import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Input, Button, Spacer, Modal, ModalHeader, ModalBody, ButtonGroup, ModalContent
} from "@nextui-org/react";
import { ArrowRight } from "react-iconly";

import { createProject } from "../actions/project";
import CustomTemplates from "../containers/Connections/CustomTemplates/CustomTemplates";
import Container from "./Container";
import Row from "./Row";
import Text from "./Text";

/*
  Contains the project creation functionality
*/
function ProjectForm(props) {
  const {
    createProject, onComplete, team, templates, hideType, onClose, open,
  } = props;

  const [loading, setLoading] = useState(false);
  const [newProject, setNewProject] = useState({});
  const [error, setError] = useState("");
  const [activeMenu, setActiveMenu] = useState("empty");
  const [createdProject, setCreatedProject] = useState(null);

  const _onCreateProject = (noRedirect) => {
    setLoading(true);
    return createProject(newProject)
      .then((project) => {
        setLoading(false);
        setNewProject({});
        setCreatedProject(project);

        if (noRedirect) return project;

        return onComplete(project);
      })
      .catch((error) => {
        setLoading(false);
        setError(error);
      });
  };

  const _onCompleteTemplate = () => {
    setTimeout(() => {
      onComplete(createdProject, false);
    }, 1000);
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      closeButton
      width={activeMenu === "template" ? "800px" : "400px"}
    >
      <ModalContent>
        <ModalHeader>
          <Text h3>Create a new project</Text>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={(e) => {
            e.preventDefault();
            _onCreateProject();
          }}>
            <Container>
              <Spacer y={2} />
              <Row align="center">
                <Input
                  onChange={(e) => setNewProject({
                    ...newProject,
                    name: e.target.value,
                    team_id: team.active.id,
                  })}
                  labelPlaceholder="Enter a name for your project"
                  fullWidth
                  size="lg"
                  variant="bordered"
                  autoFocus
                  value={newProject.name}
                />
              </Row>
              {error && (
                <Row>
                  <Text color="red">
                    {error}
                  </Text>
                </Row>
              )}
              <Spacer y={1} />
              {!hideType && (
                <Row align="center" justify="center">
                  <ButtonGroup size="sm" disabled={!newProject.name}>
                    <Button
                      ghost={activeMenu !== "empty"}
                      onClick={() => setActiveMenu("empty")}
                      auto
                    >
                      Empty project
                    </Button>
                    <Button
                      ghost={activeMenu !== "template"}
                      onClick={() => setActiveMenu("template")}
                    >
                      From template
                    </Button>
                  </ButtonGroup>
                </Row>
              )}
              <Spacer y={1} />
              {activeMenu === "empty" && (
                <>
                  <Spacer y={1} />
                  <Row align="center" justify="center">
                    <Button
                      disabled={!newProject.name || loading}
                      onClick={() => _onCreateProject()}
                      endContent={<ArrowRight />}
                      auto
                      isLoading={loading}
                    >
                      {"Create"}
                    </Button>
                  </Row>
                </>
              )}
            </Container>
          </form>

          {activeMenu === "template" && (
            <>
              <CustomTemplates
                templates={templates.data}
                loading={templates.loading}
                teamId={team.id}
                projectId={createdProject && createdProject.id}
                connections={[]}
                onComplete={_onCompleteTemplate}
                onCreateProject={() => _onCreateProject(true)}
              />
            </>
          )}
          <Spacer y={1} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

ProjectForm.defaultProps = {
  onComplete: () => {},
  hideType: false,
};

ProjectForm.propTypes = {
  createProject: PropTypes.func.isRequired,
  onComplete: PropTypes.func,
  team: PropTypes.object.isRequired,
  templates: PropTypes.object.isRequired,
  hideType: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  return {
    team: state.team,
    templates: state.template
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createProject: data => dispatch(createProject(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectForm);
