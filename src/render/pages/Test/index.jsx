/* eslint-disable jsx-a11y/accessible-emoji */
import React, { memo, useEffect } from 'react'
import { connect } from 'umi'

import styles from './index.less'

export default connect(({ customerManage, loading }) => ({
  customerManage,
  infoLoading: loading.effects['customerManage/getCustomerInfo'],
}))(
  memo(props => {
    const { infoLoading, dispatch } = props
    console.log(infoLoading)

    // 获取客户信息
    useEffect(() => {
      dispatch({
        type: 'customerManage/getCustomerInfo',
      })
    }, [])

    return (
      <div className={styles.customerManage}>
        <h2> I am already a mature page 👻</h2>
      </div>
    )
  }),
)
