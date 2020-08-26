import React from 'react'
import styles from './index.less'

const Loading = props => {
  const { margin } = props
  return (
    <div className={styles['spinner-detail']} style={{ padding: `${margin} auto` || '30vw auto' }}>
      <div className={styles.spinnerContent}>
        <div className={styles.dot1} />
        <div className={styles.dot2} />
      </div>
    </div>
  )
}
export default Loading
