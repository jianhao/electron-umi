import React, { memo, useEffect, useState } from 'react'
import { connect } from 'umi'
import { Button, Flex } from 'antd-mobile'
import NativeBridge from '@/utils/NativeBridge'
import NoData from '@/components/NoData'
import Loading from '@/components/Loading'
import CustomerItem from './components/CustomerItem'
import styles from './index.less'

export default connect(({ customerManage, loading }) => ({
  customerManage,
  infoLoading: loading.effects['customerManage/getCustomerInfo'],
  listLoading: loading.effects['customerManage/queryCustomer'],
}))(
  memo(props => {
    const { customerManage, listLoading, infoLoading, dispatch } = props
    const [pageNo, setPageNo] = useState(1)
    const { customerInfo, customerList = [], hasMore } = customerManage || {}
    const { invitedNum, invitingNum, orderNum, totalQuota, usedQuota } = customerInfo || {}

    // 获取客户信息
    useEffect(() => {
      dispatch({
        type: 'customerManage/getCustomerInfo',
      })
    }, [])

    // 根据页数去获取客户列表
    useEffect(() => {
      dispatch({
        type: 'customerManage/queryCustomer',
        payload: { pageNo },
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

    // 去搜索页
    const goSearch = query => {
      // orderStatus： 0 未开单 1 已开单 invitStatus 0：邀请中 1：已邀请
      const url = { url: `${window.location.origin}/kunkka/customerManage/search?${query}` }
      NativeBridge.openWebview(url)
    }

    // 去邀请页
    const goInvite = () => {
      const url = { url: `${window.location.origin}/kunkka/customerManage/invite` }
      NativeBridge.openWebview(url)
    }

    // 客户列表渲染
    const customerListRender = () => {
      if (listLoading && pageNo === 1) {
        return <Loading />
      }
      if (!customerList.length) {
        return (
          <div className={styles.customerListWrap}>
            <NoData text="目前暂无客户">
              <Button className={styles.inviteCustomerBtn} onClick={() => goInvite()}>
                邀请新客户
              </Button>
            </NoData>
          </div>
        )
      }
      return (
        <div className={styles.customerListWrap}>
          <div className={styles.customerList}>
            {(customerList || []).map(item => (
              <CustomerItem data={item} key={item.id} fromIndex />
            ))}
          </div>
        </div>
      )
    }
    return infoLoading ? (
      <Loading />
    ) : (
      <div className={styles.customerManage} onScroll={scroll}>
        {/* 客户基础信息 */}
        <Flex className={styles.quotaInfoWrap} justify="between" align="center">
          <div className={styles.quotaInfo}>
            <p className={styles.usedQuota}> 已占用额度（万元）</p>
            <div className={styles.totalQuota}>
              <span>{usedQuota} </span>/总额度<span> {totalQuota}万</span>
            </div>
          </div>
          <Button className={styles.inviteBtn} onClick={() => goInvite()}>
            邀请新客户
          </Button>
          <Flex className={styles.customerWrap} justify="start" align="center">
            <Flex
              className={styles.customerItem}
              justify="center"
              align="center"
              onClick={() => goSearch('invitStatus=1')}
            >
              <span> 已邀请客户</span>
              <span>{invitedNum}</span>
            </Flex>
            <Flex
              className={styles.customerItem}
              justify="center"
              align="center"
              onClick={() => goSearch('invitStatus=0')}
            >
              <span> 邀请中客户</span>
              <span>{invitingNum}</span>
            </Flex>
            <Flex
              className={styles.customerItem}
              justify="center"
              align="center"
              onClick={() => goSearch('orderStatus=1')}
            >
              <span> 客户总订单</span>
              <span>{orderNum}</span>
            </Flex>
          </Flex>
        </Flex>
        {/* 客户搜索和标题 */}
        <Flex className={styles.searchWrap} justify="between" align="center">
          <h3 className={styles.title}>所有客户</h3>
          {!!customerList.length && (
            <div className={styles.searchLink} onClick={() => goSearch('')}>
              <div className={styles.searchIcon} />
              <div className={styles.searchInput}>选择客户</div>
            </div>
          )}
        </Flex>
        {/* 客户列表 */}
        {customerListRender()}
        {!hasMore && pageNo > 1 && <div className={styles.noMoreDate}>没有更多数据了</div>}
      </div>
    )
  }),
)
