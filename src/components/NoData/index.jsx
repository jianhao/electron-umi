import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Flex } from 'antd-mobile'
import styles from './index.less'

function NoData(props) {
  const { children, className, text } = props

  return (
    <Flex
      className={classnames(styles.noDataWraper, className)}
      justify="start"
      align="center"
      direction="column"
    >
      <div className={styles.noDataIcon} />
      <p className={styles.noDataText}>{text}</p>
      {children}
    </Flex>
  )
}

NoData.defaultProps = {
  text: '暂无数据',
}
NoData.propTypes = {
  text: PropTypes.string,
}

export default NoData
