import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import ClickOutside from 'react-click-outside';
import DeleteCaution from './DeleteCaution';
import { IS_SAAS_SERVICE } from '../../config';
import DeleteMessaging from './DeleteMessaging';
import {
    hideDeleteModal,
    deleteProject,
    switchProject,
    hideDeleteModalSaasMode,
} from '../../actions/project';
import { history } from '../../store';

export class DeleteProjectModal extends Component {
    constructor(props: $TSFixMe) {
        super(props);
        this.state = {
            deleted: false,
        };

        this.deleteProject = this.deleteProject.bind(this);
        this.closeNotice = this.closeNotice.bind(this);
    }

    deleteProject(values: $TSFixMe) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'projectId' does not exist on type 'Reado... Remove this comment to see the full error message
        const { projectId, deleteProject } = this.props;

        deleteProject(projectId, values.feedback).then(() => {
            this.setState({ deleted: true });
            this.closeNotice();
        });
    }

    closeNotice() {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'switchProject' does not exist on type 'R... Remove this comment to see the full error message
        const { switchProject, nextProject } = this.props;
        if (!IS_SAAS_SERVICE) {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'hideDeleteModal' does not exist on type ... Remove this comment to see the full error message
            this.props.hideDeleteModal();
        }
        if (nextProject) switchProject(nextProject);
        else history.push('/');
    }

    render() {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'deleted' does not exist on type 'Readonl... Remove this comment to see the full error message
        const { deleted } = this.state;
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'deletedModal' does not exist on type 'Re... Remove this comment to see the full error message
        const { deletedModal, deletedProjectSuccess } = this.props;
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'visible' does not exist on type 'Readonl... Remove this comment to see the full error message
        return this.props.visible ? (
            <div className="ModalLayer-wash Box-root Flex-flex Flex-alignItems--flexStart Flex-justifyContent--center">
                <div
                    className="ModalLayer-contents"
                    tabIndex={-1}
                    style={{ marginTop: 40 }}
                >
                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'hideDeleteModal' does not exist on type ... Remove this comment to see the full error message
                    <ClickOutside onClickOutside={this.props.hideDeleteModal}>
                        {deletedModal ? (
                            <div className="bs-BIM">
                                {/* <DeleteRequestModal
                                closeNotice={this.closeNotice}
                                requesting={this.props.isRequesting}
                            /> */}
                                <DeleteCaution
                                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'hideDeleteModal' does not exist on type ... Remove this comment to see the full error message
                                    hide={this.props.hideDeleteModal}
                                    deleteProject={this.deleteProject}
                                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'isRequesting' does not exist on type 'Re... Remove this comment to see the full error message
                                    requesting={this.props.isRequesting}
                                    deleteSuccess={deletedProjectSuccess}
                                    hideOnDelete={
                                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'hideDeleteModalSaasMode' does not exist ... Remove this comment to see the full error message
                                        this.props.hideDeleteModalSaasMode
                                    }
                                />
                            </div>
                        ) : (
                            <div className="bs-BIM">
                                <DeleteMessaging
                                    // @ts-expect-error ts-migrate(2322) FIXME: Type '{ hide: any; deleteProject: (values: any) =>... Remove this comment to see the full error message
                                    hide={this.props.hideDeleteModal}
                                    deleteProject={this.deleteProject}
                                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'isRequesting' does not exist on type 'Re... Remove this comment to see the full error message
                                    requesting={this.props.isRequesting}
                                    deleted={deleted}
                                    // showDeleteModal="show"
                                />
                            </div>
                        )}
                    </ClickOutside>
                </div>
            </div>
        ) : null;
    }
}

// @ts-expect-error ts-migrate(2339) FIXME: Property 'displayName' does not exist on type 'typ... Remove this comment to see the full error message
DeleteProjectModal.displayName = 'DeleteProjectModal';

const mapDispatchToProps = (dispatch: $TSFixMe) => bindActionCreators(
    {
        deleteProject,
        hideDeleteModal,
        hideDeleteModalSaasMode,
        switchProject: project => switchProject(dispatch, project),
    },
    dispatch
);

const mapStateToProps = (state: $TSFixMe) => {
    const { projects } = state.project.projects;
    const projectId =
        state.project.currentProject && state.project.currentProject._id;
    const project =
        projects !== undefined && projects.length > 0
            ? projects.filter((project: $TSFixMe) => project._id === projectId)[0]
            : [];

    const nextProject =
        projects !== undefined && projects.length > 0
            ? projects.filter((project: $TSFixMe) => project._id !== projectId)[0]
            : {};

    const projectName = project && project.name;

    return {
        projectName,
        projectId,
        nextProject,
        visible: state.project.showDeleteModal,
        isRequesting: state.project.deleteProject.requesting,
        deletedProjectSuccess: state.project.deleteProject.deleted,
        deletedModal: state.project.deletedModal,
    };
};

// @ts-expect-error ts-migrate(2339) FIXME: Property 'propTypes' does not exist on type 'typeo... Remove this comment to see the full error message
DeleteProjectModal.propTypes = {
    deleteProject: PropTypes.func.isRequired,
    switchProject: PropTypes.func.isRequired,
    hideDeleteModal: PropTypes.func.isRequired,
    hideDeleteModalSaasMode: PropTypes.func.isRequired,
    nextProject: PropTypes.oneOfType([
        PropTypes.oneOf([null, undefined]),
        PropTypes.object,
    ]),
    projectId: PropTypes.string,
    visible: PropTypes.bool,
    isRequesting: PropTypes.bool,
    deletedModal: PropTypes.bool,
    deletedProjectSuccess: PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteProjectModal);