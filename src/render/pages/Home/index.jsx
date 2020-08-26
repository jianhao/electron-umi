import React, { memo, useEffect, useState } from 'react'
import { connect } from 'umi'
import Loading from '@/components/Loading'
import styles from './index.less'

export default connect(({ customerManage, loading }) => ({
  customerManage,
  infoLoading: loading.effects['customerManage/getCustomerInfo'],
  listLoading: loading.effects['customerManage/queryCustomer'],
}))(
  memo(props => {
    const { customerManage, listLoading, infoLoading } = props
    const [pageNo, setPageNo] = useState(1)
    const { hasMore } = customerManage || {}

    // 获取客户信息
    useEffect(() => {
      // dispatch({
      //   type: 'customerManage/getCustomerInfo',
      // })
    }, [])

    // 根据页数去获取客户列表
    useEffect(() => {
      // dispatch({
      //   type: 'customerManage/queryCustomer',
      //   payload: { pageNo },
      // })
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

    return infoLoading ? (
      <Loading />
    ) : (
      <div className={styles.home} onScroll={scroll}>
        Electron 应用开发
      </div>
    )
  }),
)
