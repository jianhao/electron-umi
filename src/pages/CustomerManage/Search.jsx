import React, { memo, useEffect, useState } from 'react'
import { connect, useLocation } from 'umi'
import { SearchBar } from 'antd-mobile'
import debounce from 'lodash/debounce'
import classnames from 'classnames'
import NoData from '@/components/NoData'
import Loading from '@/components/Loading'
import CustomerItem from './components/CustomerItem'

import styles from './Search.less'

export default connect(({ customerManage, loading }) => ({
  customerManage,
  listLoading: loading.effects['customerManage/queryCustomer'],
}))(
  memo(props => {
    const { customerManage, listLoading, dispatch } = props
    const { customerList = [], hasMore } = customerManage || {}
    const [keyword, setKeyword] = useState('')
    const [pageNo, setPageNo] = useState(1)
    const { query: { invitStatus, orderStatus } = {} } = useLocation() || {} // orderStatus： 0 未开单 1 已开单 invitStatus 0：邀请中 1：已邀请核
    if (orderStatus === '1') {
      document.title = '客户订单信息'
    } else if (invitStatus === '1') {
      document.title = '已邀请的客户'
    } else if (invitStatus === '0') {
      document.title = '邀请中的客户'
    }

    // // 从二级页面返回要刷新
    // useEffect(() => {
    //   window.unifyCallBack = () => {
    //     window.location.reload()
    //   }
    // }, [])

    // 获取客户列表
    useEffect(() => {
      dispatch({
        type: 'customerManage/queryCustomer',
        payload: { pageNo, invitStatus: Number(invitStatus), orderStatus: Number(orderStatus) },
      })
    }, [pageNo])

    // 上拉到底部加载更多
    const scroll = e => {
      const elem = e.target
      const { scrollHeight } = elem
      const { scrollTop } = elem
      const height = elem.clientHeight
      if (scrollTop + height >= scrollHeight - 300 && hasMore && !listLoading) {
        // 距离底部300px
        setPageNo(pageNo + 1)
      }
    }

    // 关键字搜索客户
    const searchModal = debounce(
      key => {
        setKeyword(key)
        dispatch({
          type: 'customerManage/queryCustomer',
          payload: {
            pageNo: 1,
            partnerName: key,
            invitStatus: Number(invitStatus),
            orderStatus: Number(orderStatus),
          },
        })
      },
      500,
      { leading: false, trailing: true },
    )

    return (
      <div className={styles.customerSearch} onScroll={scroll}>
        <SearchBar
          defaultValue={keyword}
          className={classnames('customSearch', styles.customerSearch)}
          placeholder="请输入要查询的客户名称"
          maxLength={8}
          onChange={searchModal}
        />
        {listLoading && pageNo === 1 ? (
          <Loading />
        ) : (
          <div className={styles.customerListWrap}>
            {!customerList.length ? (
              <NoData text="暂无符合条件的客户" />
            ) : (
              <div className={styles.customerList}>
                {(customerList || []).map(item => (
                  <CustomerItem data={item} key={item.id ? item.id : item.companyPartnerId} />
                ))}
              </div>
            )}
          </div>
        )}
        {!hasMore && pageNo > 1 && <div className={styles.noMoreDate}>没有更多数据了</div>}
      </div>
    )
  }),
)
