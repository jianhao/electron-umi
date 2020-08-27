import React, { memo, useEffect, useState } from 'react'
import { connect } from 'umi'
import styles from './index.less'

export default connect(({ customerManage }) => ({
  customerManage,
}))(
  memo(props => {
    const { customerManage, listLoading, dispatch } = props
    const [pageNo, setPageNo] = useState(1)
    const { hasMore } = customerManage || {}

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

    return (
      <div className={styles.home} onScroll={scroll}>
        Hello Electron!
      </div>
    )
  }),
)
