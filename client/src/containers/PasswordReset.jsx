import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import {
  Button, Input, Spacer,
} from "@nextui-org/react";

import { changePasswordWithToken } from "../actions/user";
import { cleanErrors as cleanErrorsAction } from "../actions/error";
import cbLogoSmall from "../assets/logo_inverted.png";
import cbLogo from "../assets/logo_blue.png";
import Container from "../components/Container";
import Row from "../components/Row";
import Text from "../components/Text";
import useThemeDetector from "../modules/useThemeDetector";
import Callout from "../components/Callout";

/*
  Component for verifying a new user
*/
function PasswordReset(props) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const { cleanErrors, changePasswordWithToken, history } = props;

  const isDark = useThemeDetector();

  useEffect(() => {
    cleanErrors();
  }, []);

  const _onSubmit = () => {
    const params = new URLSearchParams(document.location.search);

    if (!password || password.length < 6) {
      setError("Please enter at least 6 characters for your password");
      return;
    }

    if (password !== passwordConfirm) {
      setError("The passwords are not matching");
      return;
    }
    setLoading(true);
    setSuccess(false);
    setError(false);
    changePasswordWithToken({
      token: params.get("token"),
      hash: params.get("hash"),
      password,
    })
      .then(() => {
        setSuccess(true);
        setLoading(false);
        setPassword("");
        setPasswordConfirm("");
        setTimeout(() => {
          history.push("/login");
        }, 3000);
      })
      .catch(() => {
        setLoading(false);
        setError("The request failed, please try again or get in touch with us for help.");
      });
  };

  return (
    <div style={styles.container}>
      <Container size="sm">
        <Row>
          <Link to="/">
            <img src={isDark ? cbLogoSmall : cbLogo} style={{ width: 70 }} alt="Chartbrew logo" />
          </Link>
        </Row>
        <Spacer y={1} />
        <Row>
          <Text size="h2">
            Forgot your password?
          </Text>
        </Row>
        <Row>
          <Text size="h4">{"No worries, complete the form below to change to a brand new one"}</Text>
        </Row>
        <Spacer y={1} />
        <Row>
          <Input
            label="New password"
            placeholder="Enter your new password"
            type="password"
            value={password || ""}
            onChange={(e) => setPassword(e.target.value)}
            bordered
            fullWidth
          />
        </Row>
        <Spacer y={0.5} />
        <Row>
          <Input
            label="Confirm your new password"
            placeholder="Write your new password again"
            type="password"
            value={passwordConfirm || ""}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            fullWidth
            bordered
          />
        </Row>
        <Spacer y={1} />
        <Row>
          <Button
            type="submit"
            size="lg"
            disabled={success}
            onClick={_onSubmit}
            auto
            isLoading={loading}
          >
            Change password
          </Button>
        </Row>
        <Spacer y={1} />
        {success && (
          <Row>
            <Callout
              type="success"
              title="Your password was changed successfully"
              description="You will now be redirected to the Login page where you can use your new password to authenticate."
            />
          </Row>
        )}

        {error && (
          <Row>
            <Callout
              type="error"
              title="The password could not be changed"
              description={error}
            />
          </Row>
        )}
      </Container>
    </div>
  );
}

const styles = {
  container: {
    paddingBottom: 50,
    paddingTop: 50,
  },
};

PasswordReset.propTypes = {
  changePasswordWithToken: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  cleanErrors: PropTypes.func.isRequired,
};

const mapStateToProps = () => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changePasswordWithToken: (data) => dispatch(changePasswordWithToken(data)),
    cleanErrors: () => dispatch(cleanErrorsAction()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PasswordReset));
