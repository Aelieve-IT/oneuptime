import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ShouldRender from '../basic/ShouldRender';
import SlackTeamItem from './SlackTeamItem';
import { getSlackTeams, paginate } from '../../actions/slack';
import { OnCallTableHeader } from '../onCall/OnCallData';
import { ListLoader } from '../basic/Loader';

class SlackTeamList extends React.Component {
    handleKeyBoard: $TSFixMe;
    ready() {
        const {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'teams' does not exist on type 'Readonly<... Remove this comment to see the full error message
            teams: { teams },
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'getSlackTeams' does not exist on type 'R... Remove this comment to see the full error message
            getSlackTeams,
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'projectId' does not exist on type 'Reado... Remove this comment to see the full error message
            projectId,
        } = this.props;
        if (teams.length === 0 && projectId) {
            getSlackTeams(projectId);
        }
    }

    componentDidMount() {
        this.ready();
    }

    componentWillUnmount() {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'paginate' does not exist on type 'Readon... Remove this comment to see the full error message
        this.props.paginate('reset');
    }

    prevClicked = () => {
        const {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'teams' does not exist on type 'Readonly<... Remove this comment to see the full error message
            teams: { skip, limit },
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'getSlackTeams' does not exist on type 'R... Remove this comment to see the full error message
            getSlackTeams,
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'projectId' does not exist on type 'Reado... Remove this comment to see the full error message
            projectId,
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'paginate' does not exist on type 'Readon... Remove this comment to see the full error message
            paginate,
        } = this.props;

        getSlackTeams(
            projectId,
            (skip || 0) > (limit || 10) ? skip - limit : 0,
            10
        );
        paginate('prev');
    };

    nextClicked = () => {
        const {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'teams' does not exist on type 'Readonly<... Remove this comment to see the full error message
            teams: { skip, limit },
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'getSlackTeams' does not exist on type 'R... Remove this comment to see the full error message
            getSlackTeams,
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'projectId' does not exist on type 'Reado... Remove this comment to see the full error message
            projectId,
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'paginate' does not exist on type 'Readon... Remove this comment to see the full error message
            paginate,
        } = this.props;

        getSlackTeams(projectId, skip + limit, 10);
        paginate('next');
    };

    render() {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'projectId' does not exist on type 'Reado... Remove this comment to see the full error message
        const { projectId, teams } = this.props;
        const { error, requesting } = teams;
        const { count } = teams;
        let canPaginateForward =
            teams.teams && teams.count && teams.count > teams.skip + teams.limit
                ? true
                : false;
        let canPaginateBackward = teams && teams.skip <= 0 ? false : true;
        const numberOfTeams = teams.teams.length;

        if (teams && (teams.requesting || !teams.teams)) {
            canPaginateForward = false;
            canPaginateBackward = false;
        }

        return (
            <React.Fragment>
                <div style={{ overflow: 'hidden', overflowX: 'auto' }}>
                    <table className="Table" onKeyDown={this.handleKeyBoard}>
                        <thead className="Table-body">
                            <tr className="Table-row db-ListViewItem db-ListViewItem-header">
                                <OnCallTableHeader text="Connected workspace" />
                                <OnCallTableHeader text="" />
                            </tr>
                        </thead>
                        <tbody className="Table-body">
                            <ShouldRender if={teams.teams.length > 0}>
                                {teams.teams.map((res: Response) => <SlackTeamItem
                                    key={`${res._id}`}
                                    // @ts-expect-error ts-migrate(2322) FIXME: Type '{ key: string; team: any; projectId: any; }'... Remove this comment to see the full error message
                                    team={res}
                                    projectId={projectId}
                                />)}
                            </ShouldRender>
                        </tbody>
                    </table>
                </div>

                <ShouldRender if={requesting}>
                    <ListLoader />
                </ShouldRender>
                <ShouldRender if={error}>
                    <div
                        id="app-loading"
                        style={{
                            position: 'fixed',
                            top: '0',
                            bottom: '0',
                            left: '0',
                            right: '0',
                            zIndex: '999',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            padding: '0 10px',
                        }}
                    >
                        <div>Cannot connect to server.</div>
                    </div>
                </ShouldRender>
                <ShouldRender
                    if={teams.teams.length === 0 && !requesting && !error}
                >
                    <div className="Box-root">
                        <br />
                        <div
                            id="app-loading"
                            style={{
                                zIndex: '1',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                                textAlign: 'center',
                                padding: '0 10px',
                            }}
                        >
                            <span>
                                You don&#39;t have any Slack workspace
                                connected. Do you want to connect one?
                            </span>
                            <br />
                        </div>
                        <br />
                    </div>
                </ShouldRender>
                <div
                    className="Box-root Flex-flex Flex-alignItems--center Flex-justifyContent--spaceBetween"
                    style={{ paddingRight: 10 }}
                >
                    <div className="Box-root Flex-flex Flex-alignItems--center Padding-all--20">
                        <span className="Text-color--inherit Text-display--inline Text-fontSize--14 Text-fontWeight--regular Text-lineHeight--20 Text-typeface--base Text-wrap--wrap">
                            <span>
                                <span className="Text-color--inherit Text-display--inline Text-fontSize--14 Text-fontWeight--medium Text-lineHeight--20 Text-typeface--base Text-wrap--wrap">
                                    {count} Slack workspace
                                    {numberOfTeams <= 1 ? '' : 's'}
                                </span>
                            </span>
                        </span>
                    </div>
                    <div className="Box-root Padding-horizontal--20 Padding-vertical--16">
                        <div className="Box-root Flex-flex Flex-alignItems--stretch Flex-direction--row Flex-justifyContent--flexStart">
                            <div className="Box-root Margin-right--8">
                                <button
                                    className={`Button bs-ButtonLegacy ${!canPaginateBackward
                                        ? 'Is--disabled'
                                        : ''
                                        }`}
                                    data-db-analytics-name="list_view.pagination.previous"
                                    disabled={!canPaginateBackward}
                                    type="button"
                                    onClick={this.prevClicked}
                                >
                                    <div className="Button-fill bs-ButtonLegacy-fill Box-root Box-background--white Flex-inlineFlex Flex-alignItems--center Flex-direction--row Padding-horizontal--8 Padding-vertical--4">
                                        <span className="Button-label Text-color--default Text-display--inline Text-fontSize--14 Text-fontWeight--medium Text-lineHeight--20 Text-typeface--base Text-wrap--noWrap">
                                            <span>Previous</span>
                                        </span>
                                    </div>
                                </button>
                            </div>
                            <div className="Box-root">
                                <button
                                    className={`Button bs-ButtonLegacy ${!canPaginateForward
                                        ? 'Is--disabled'
                                        : ''
                                        }`}
                                    data-db-analytics-name="list_view.pagination.next"
                                    disabled={!canPaginateForward}
                                    type="button"
                                    onClick={this.nextClicked}
                                >
                                    <div className="Button-fill bs-ButtonLegacy-fill Box-root Box-background--white Flex-inlineFlex Flex-alignItems--center Flex-direction--row Padding-horizontal--8 Padding-vertical--4">
                                        <span className="Button-label Text-color--default Text-display--inline Text-fontSize--14 Text-fontWeight--medium Text-lineHeight--20 Text-typeface--base Text-wrap--noWrap">
                                            <span>Next</span>
                                        </span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

// @ts-expect-error ts-migrate(2339) FIXME: Property 'displayName' does not exist on type 'typ... Remove this comment to see the full error message
SlackTeamList.displayName = 'SlackTeamList';

const mapStateToProps = (state: $TSFixMe) => ({
    teams: state.slack.teams,
    currentProject: state.project.currentProject,
    projectId: state.project.currentProject && state.project.currentProject._id
});

const mapDispatchToProps = (dispatch: $TSFixMe) => bindActionCreators(
    {
        getSlackTeams,
        paginate,
    },
    dispatch
);

// @ts-expect-error ts-migrate(2339) FIXME: Property 'propTypes' does not exist on type 'typeo... Remove this comment to see the full error message
SlackTeamList.propTypes = {
    getSlackTeams: PropTypes.func,
    projectId: PropTypes.string,
    teams: PropTypes.any,
    paginate: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(SlackTeamList);