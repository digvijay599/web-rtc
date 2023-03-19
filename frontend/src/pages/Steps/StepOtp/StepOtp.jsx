import React, { useState } from "react";
import Card from '../../../components/shared/Card/Card';
import Button from '../../../components/shared/Button/Button';
import TextInput from "../../../components/shared/TextInput/TextInput";
import styles from "./StepOtp.module.css";

const StepOtp = ({ onNext }) => {
  const [otp, setOtp] = useState("");

  return (
    <div className={ styles.cardWrapper }>
      <div>
        <Card title="Enter your OTP number" icon="phone">
          <TextInput
            value={ otp }
            onChange={ (e) => setOtp(e.target.value) }
          />
          <div>
            <div className={ styles.actionButtonWrap }>
              <Button text="Next" onClick={ onNext }></Button>
            </div>
            <p className={ styles.bottomParagraph }>
              By entering your number, you're agreeing to our Terms of
              Service and Privacy Policy. Thanks!
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
};

export default StepOtp;