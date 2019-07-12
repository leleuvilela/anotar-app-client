import React, { Component } from "react";
import { API, Storage } from "aws-amplify";
import { Form } from "react-bootstrap";
import LoaderButton from "../../components/LoaderButton";
import config from "../../config";
import { s3Upload } from "../../libs/awsLib";

import "./style.css";

class Notes extends Component {
  file = null;

  state = {
    isLoading: null,
    isDeleting: null,
    note: null,
    content: "",
    attachmentURL: null
  };

  async componentDidMount() {
    try {
      let attachmentURL;
      const note = await this.getNote();
      const { content, attachment } = note;

      if (attachment) {
        attachmentURL = await Storage.vault.get(attachment);
      }
      console.log(note);
      this.setState({
        note,
        content,
        attachmentURL
      });
    } catch (e) {}
  }

  getNote() {
    return API.get("notes", `/notes/${this.props.match.params.id}`);
  }

  validateForm() {
    return this.state.content.length > 0;
  }

  formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleFileChange = event => {
    this.file = event.target.files[0];
  };

  handleSubmit = async event => {
    event.preventDefault();

    let attachment;

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE /
          1000000} MB.`
      );
      return;
    }

    this.setState({ isLoading: true });

    try {
      if (this.file) {
        attachment = await s3Upload(this.file);
      }
  
      await this.saveNote({
        content: this.state.content,
        attachment: attachment || this.state.note.attachment
      });
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  };

  handleDelete = async event => {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    this.setState({ isDeleting: true });

    try {
      await this.deleteNote();
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isDeleting: false });
    }
  };

  saveNote(note) {
    return API.put("notes", `/notes/${this.props.match.params.id}`, {
      body: note
    });
  }

  deleteNote() {
    return API.del("notes", `/notes/${this.props.match.params.id}`);
  }
  

  render() {
    return (
      <div className="Notes">
        {this.state.note && (
          <form onSubmit={this.handleSubmit}>
            <Form.Group controlId="content">
              <Form.Control
                onChange={this.handleChange}
                value={this.state.content}
                as="textarea"
              />
            </Form.Group>
            {this.state.note.attachment && (
              <Form.Group>
                <Form.Label>Attachment</Form.Label>
                <div>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={this.state.attachmentURL}
                  >
                    {this.formatFilename(this.state.note.attachment)}
                  </a>
                </div>
              </Form.Group>
            )}
            <Form.Group controlId="file">
              {!this.state.note.attachment && (
                <Form.Label>Attachment</Form.Label>
              )}
              <Form.Control onChange={this.handleFileChange} type="file" />
            </Form.Group>
            <LoaderButton
              block
              variant="primary"
              size="large"
              disabled={!this.validateForm()}
              type="submit"
              isLoading={this.state.isLoading}
              text="Save"
              loadingText="Saving…"
            />
            <LoaderButton
              block
              variant="danger"
              size="large"
              isLoading={this.state.isDeleting}
              onClick={this.handleDelete}
              text="Delete"
              loadingText="Deleting…"
            />
          </form>
        )}
      </div>
    );
  }
}

export default Notes;
