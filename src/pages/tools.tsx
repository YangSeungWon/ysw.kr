import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from '../components/HomepageFeatures/Tools.module.css';

const Tools: React.FC = () => {
  return (
    <Layout title="Tools">
      <div className={styles.toolsContainer}>
        <h1>Tools</h1>
        <div className={styles.buttonGrid}>
          <Link to="/tools/ip" className={styles.toolButton}>
            <span className={styles.toolName}>IP</span>
            <span className={styles.toolDescription}>Get your IP address</span>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Tools;