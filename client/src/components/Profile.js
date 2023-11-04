import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button,
  Card,
  CardTitle,
  CardSubtitle,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import PropTypes from "prop-types";
import "./style.css";
import { Redirect } from "react-router-dom";
import { logout, update } from "../actions/authActions";
import { buttonReset, isLoading } from "../actions/uiActions";
import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
  region: "us-east-1",
  sessionToken: process.env.REACT_APP_SESSION_TOKEN,
});

export class Profile extends Component {
  static propTypes = {
    button: PropTypes.bool,
    authState: PropTypes.object.isRequired,
    buttonReset: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
  };

  onLogout = (e) => {
    e.preventDefault();
    this.props.buttonReset();
    this.props.logout();
  };

  handleImpageInput = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    this.setState({ file });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    const s3 = new AWS.S3();
    if (this.state.file) {
      const params = {
        Bucket: "bhikadiyab00945545",
        Key: this.state.file.name,
        Body: this.state.file,
      };
      const response = await s3.upload(params).promise();
      const profile = response.Location;
      const id = this.props.authState.user.id;
      if (profile) {
        const user = { profile, id };
        this.props.isLoading();
        this.props.update(user);
      }
    }
  };

  render() {
    if (!this.props.authState.isAuthenticated) {
      return <Redirect to="/" />;
    }

    const { user } = this.props.authState;

    return (
      <div className="container">
        <div className="main">
          <Card>
            <CardBody>
              <CardTitle>
                <div>
                  <img
                    src={user?.profile}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <h1>
                  {user ? `Welcome, ${user.name}` : ""}{" "}
                  <span role="img" aria-label="party-popper">
                    🎉{" "}
                  </span>{" "}
                </h1>
              </CardTitle>
              <br />
              <CardSubtitle>
                <h5>
                  {" "}
                  You are now Logged In{" "}
                  <span role="img" aria-label="clap">
                    👏{" "}
                  </span>
                </h5>
              </CardSubtitle>
              <br />
              <Button size="lg" onClick={this.onLogout} color="primary">
                Logout
              </Button>
              <Form onSubmit={this.onSubmit} style={{ marginTop: "20px" }}>
                <FormGroup>
                  <Label for="file">Upload Profile Picture</Label>
                  <Input
                    type="file"
                    name="file"
                    id="file"
                    size="lg"
                    placeholder="Choose File"
                    className="mb-3"
                    style={{ backgroundColor: "dodgerblue" }}
                    onChange={this.handleImpageInput}
                  />
                  <Button
                    size="lg"
                    style={{ marginLeft: "10px" }}
                    color="primary"
                  >
                    Update Profile Picture
                  </Button>
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  //Maps state to redux store as props
  button: state.ui.button,
  authState: state.auth,
});

export default connect(mapStateToProps, {
  logout,
  buttonReset,
  update,
  isLoading,
})(Profile);
