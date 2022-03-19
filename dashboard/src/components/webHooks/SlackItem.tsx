import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { deleteSlack, updateSlack } from '../../actions/slackWebhook';
import { openModal, closeModal } from '../../actions/modal';
import EditSlack from '../modals/EditSlackWebhook';
import RenderIfAdmin from '../basic/RenderIfAdmin';
import DataPathHoC from '../DataPathHoC';
import DeleteSlack from '../modals/DeleteSlackWebhook';

class SlackItem extends React.Component {
    deleteItem = () => {
        const {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'monitors' does not exist on type 'Readon... Remove this comment to see the full error message
            monitors,
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'monitorId' does not exist on type 'Reado... Remove this comment to see the full error message
            monitorId,
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Readonly<{... Remove this comment to see the full error message
            data,
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'updateSlack' does not exist on type 'Rea... Remove this comment to see the full error message
            updateSlack,
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'currentProject' does not exist on type '... Remove this comment to see the full error message
            currentProject,
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'deleteSlack' does not exist on type 'Rea... Remove this comment to see the full error message
            deleteSlack,
        } = this.props;

        //check if monitorId is present
        //if the webhook contains more than one monitor just remove the monitor from it
        //if not delete the monitor
        if (monitorId) {
            const newMonitors = monitors
                .filter((monitor: $TSFixMe) => monitor.monitorId._id !== monitorId)
                .map((monitor: $TSFixMe) => ({
                monitorId: monitor.monitorId._id
            }));

            if (newMonitors.length > 0) {
                const postObj = {};
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'endpoint' does not exist on type '{}'.
                postObj.endpoint = data && data.data.endpoint;
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'webHookName' does not exist on type '{}'... Remove this comment to see the full error message
                postObj.webHookName = data && data.webHookName;
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'monitors' does not exist on type '{}'.
                postObj.monitors = newMonitors;
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'type' does not exist on type '{}'.
                postObj.type = 'slack';
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'endpointType' does not exist on type '{}... Remove this comment to see the full error message
                postObj.endpointType = data && data.data.endpointType;

                // @ts-expect-error ts-migrate(2339) FIXME: Property 'incidentCreated' does not exist on type ... Remove this comment to see the full error message
                postObj.incidentCreated =
                    data && data.notificationOptions.incidentCreated;
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'incidentResolved' does not exist on type... Remove this comment to see the full error message
                postObj.incidentResolved =
                    data && data.notificationOptions.incidentResolved;
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'incidentAcknowledged' does not exist on ... Remove this comment to see the full error message
                postObj.incidentAcknowledged =
                    data && data.notificationOptions.incidentAcknowledged;
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'incidentNoteAdded' does not exist on typ... Remove this comment to see the full error message
                postObj.incidentNoteAdded =
                    data && data.notificationOptions.incidentNoteAdded;

                return updateSlack(currentProject._id, data._id, postObj);
            } else {
                return deleteSlack(currentProject._id, data._id);
            }
        } else {
            return deleteSlack(currentProject._id, data._id);
        }
    };

    getMonitors(monitors: $TSFixMe) {
        const gt = (i: $TSFixMe) => monitors.length > i;

        let temp = gt(0) ? monitors[0].name : 'Not Yet Added';
        temp += gt(1)
            ? ` and ${monitors.length - 1} other${gt(2) ? 's' : ''}`
            : '';

        return temp;
    }

    render() {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Readonly<{... Remove this comment to see the full error message
        const { data, monitorId, webhooks, monitors } = this.props;
        const { webHookName } = data.data;
        let deleting = false;
        const monitorName = monitors && monitors[0].monitorId.name;
        const monitorTitle =
            monitors && monitors.length > 1
                ? `${monitorName} and ${monitors?.length - 1} other${
                      monitors?.length - 1 === 1 ? '' : 's'
                  }`
                : monitorName;
        if (
            webhooks &&
            webhooks.deleteWebHook &&
            webhooks.deleteWebHook.requesting
        ) {
            deleting = true;
        }

        return (
            <tr className="webhook-list-item Table-row db-ListViewItem bs-ActionsParent db-ListViewItem--hasLink slack-list">
                <td className="Table-cell Table-cell--align--left Table-cell--verticalAlign--top Table-cell--width--minimized Table-cell--wrap--noWrap db-ListViewItem-cell">
                    <div className="db-ListViewItem-cellContent Box-root Padding-vertical--16 Padding-horizontal--8">
                        <span className="db-ListViewItem-text Text-color--inherit Text-display--inline Text-fontSize--14 Text-fontWeight--regular Text-lineHeight--20 Text-typeface--base Text-wrap--wrap">
                            <div
                                className="Box-root"
                                style={{
                                    width: '300px',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                }}
                            >
                                <span id={`name_slack_${webHookName}`}>
                                    {webHookName}
                                </span>
                            </div>
                        </span>
                    </div>
                </td>
                {!monitorId && monitorTitle && (
                    <td className="Table-cell Table-cell--align--left Table-cell--verticalAlign--top Table-cell--width--minimized Table-cell--wrap--noWrap db-ListViewItem-cell">
                        <div className="db-ListViewItem-cellContent Box-root Padding-vertical--16 Padding-horizontal--8">
                            <span className="db-ListViewItem-text Text-color--inherit Text-display--inline Text-fontSize--14 Text-fontWeight--regular Text-lineHeight--20 Text-typeface--base Text-wrap--wrap">
                                <div
                                    className="Box-root"
                                    style={{
                                        width: '300px',
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <span>{monitorTitle}</span>
                                </div>
                            </span>
                        </div>
                    </td>
                )}

                <td className="Table-cell Table-cell--align--right Table-cell--verticalAlign--top Table-cell--width--minimized Table-cell--wrap--noWrap db-ListViewItem-cell">
                    <div
                        className="db-ListViewItem-cellContent Box-root Padding-all--12 Flex-alignContent--flexEnd"
                        style={{ marginLeft: '-5px' }}
                    >
                        <span className="db-ListViewItem-text Text-color--inherit Text-display--inline Text-fontSize--14 Text-fontWeight--regular Text-lineHeight--20 Text-typeface--base Text-wrap--wrap">
                            <RenderIfAdmin>
                                <div className="Box-root">
                                    <button
                                        id={`edit_slack_${webHookName}`}
                                        className="bs-Button bs-DeprecatedButton"
                                        type="button"
                                        onClick={() =>
                                            // @ts-expect-error ts-migrate(2339) FIXME: Property 'openModal' does not exist on type 'Reado... Remove this comment to see the full error message
                                            this.props.openModal({
                                                id: data._id,
                                                onClose: () => '',
                                                content: DataPathHoC(
                                                    EditSlack,
                                                    {
                                                        ...data,
                                                        currentMonitorId: monitorId,
                                                    }
                                                ),
                                            })
                                        }
                                    >
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        id={`delete_slack_${webHookName}`}
                                        className="bs-Button bs-DeprecatedButton"
                                        type="button"
                                        onClick={() =>
                                            // @ts-expect-error ts-migrate(2339) FIXME: Property 'openModal' does not exist on type 'Reado... Remove this comment to see the full error message
                                            this.props.openModal({
                                                id: data._id,
                                                onClose: () => '',
                                                onConfirm: () =>
                                                    this.deleteItem(),
                                                content: DataPathHoC(
                                                    DeleteSlack,
                                                    { deleting }
                                                ),
                                            })
                                        }
                                    >
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </RenderIfAdmin>
                        </span>
                    </div>
                </td>
            </tr>
        );
    }
}

// @ts-expect-error ts-migrate(2339) FIXME: Property 'displayName' does not exist on type 'typ... Remove this comment to see the full error message
SlackItem.displayName = 'SlackItem';

const mapDispatchToProps = (dispatch: $TSFixMe) => bindActionCreators(
    {
        deleteSlack,
        openModal,
        closeModal,
        updateSlack,
    },
    dispatch
);

const mapStateToProps = (state: $TSFixMe) => ({
    webhooks: state.webHooks,
    team: state.team,
    currentProject: state.project.currentProject
});

// @ts-expect-error ts-migrate(2339) FIXME: Property 'propTypes' does not exist on type 'typeo... Remove this comment to see the full error message
SlackItem.propTypes = {
    currentProject: PropTypes.object.isRequired,
    deleteSlack: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    monitorId: PropTypes.string,
    webhooks: PropTypes.object,
    monitors: PropTypes.array,
    updateSlack: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(SlackItem);