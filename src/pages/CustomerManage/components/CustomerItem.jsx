import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Flex } from 'antd-mobile'
import NativeBridge from '@/utils/NativeBridge'
import styles from './CustomerItem.less'

function CustomerItem(props) {
  const { data, className, children } = props // fromIndex: 当前是在首页
  const {
    examineStatus,
    carrierPullCompanyName = '',
    msg,
    orderNum,
    companyPartnerId,
    id,
    labelStatus,
  } = data || {} // examineStatus 审核状态:0 通过，1 不通过，2待审核
  const key = carrierPullCompanyName.slice(0, 1)

  // 跳转到其他页面需要展示
  const handleLink = () => {
    let url = {}
    if (orderNum) {
      url = { url: `${window.location.origin}/kunkka/customerManage/detail/${companyPartnerId}` }
    } else if (examineStatus !== 0) {
      url = { url: `${window.location.origin}/kunkka/customerManage/result/${id}` }
    } else {
      url = { url: `${window.location.origin}/kunkka/customerManage/step/${id}` }
    }
    NativeBridge.openWebview(url)
  }

  const label = msg || `已开单 ${orderNum}`
  return (
    <Flex
      className={classnames(styles.customerWraper, className)}
      justify="start"
      align="center"
      onClick={handleLink}
    >
      <div className={styles.companyAvatar}>{key}</div>
      <div className={styles.companyInfo}>
        <Flex className={styles.companyName} align="center">
          <span>{carrierPullCompanyName}</span>
          <i className={classnames(styles.companyIcon, { [styles.userIcon]: labelStatus === 2 })} />
        </Flex>
        <div
          className={classnames(styles.companyStatus, { [styles.redColor]: examineStatus === 1 })}
        >
          <i />
          {label}
        </div>
      </div>
      {children}
    </Flex>
  )
}

CustomerItem.propTypes = {
  data: PropTypes.object.isRequired,
}

export default CustomerItem
