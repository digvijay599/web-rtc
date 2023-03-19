import React from 'react';
import styles from './Home.module.css';
import { Link, useHistory } from 'react-router-dom';
import Card from '../../components/shared/Card/Card';
import Button from '../../components/shared/Button/Button';

const Home = () => {
    const singInLinkStyle = {
        color: '#0077ff',
        fontWeight: 'bold',
        textDecoration: 'none',
        marginLeft: '10px'
    };

    const history = useHistory();
    function startRegister() {
        history.push('/authenticate');
    }

    return (
        <div className={ styles.cardWrapper }>
            <Card title="Welcome to CodersHouse!" icon="logo">
                <p className={ styles.text }>
                    We're working hard to get CodersHouse ready for everyone!
                    While we wrap up the finishing youches, we're adding people
                    gradually to make sure nothing breaks
                </p>
                <div>
                    <Button onClick={ startRegister } text="Let's Go"></Button>
                </div>
                <div className={ styles.signinWrapper }>
                    <Link style={ singInLinkStyle } to="/login"><span>Have an invite text?</span></Link>
                </div>
            </Card>
        </div>
    )
};

export default Home;
