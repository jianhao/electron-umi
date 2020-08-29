import React, { memo, useEffect } from 'react'
import { connect } from 'umi'
import styles from './index.less'

export default connect(({ customerManage }) => ({
  customerManage,
}))(
  memo(props => {
    const { dispatch } = props

    // 获取客户信息
    useEffect(() => {
      dispatch({
        type: 'customerManage/getCustomerInfo',
      })
    }, [])

    return <div className={styles.home}>Hello Electron! I am jianhao</div>
  }),
)
