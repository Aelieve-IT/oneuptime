import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Tutorial from './Tutorial';
import PropTypes from 'prop-types';
import { closeTutorial } from '../../actions/tutorial';
import ApiDoc from '../oneuptimeApi/ApiDoc';
import ShouldRender from '../basic/ShouldRender';

const Tutorials = ({
    type,
    closeTutorial,
    currentProjectId
}: $TSFixMe) => (
    <div
        // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'number | ... Remove this comment to see the full error message
        tabIndex="0"
        className="Box-root Margin-vertical--12"
        id={`quick-tip-${type}`}
    >
        <div className="db-Trends bs-ContentSection Card-root Card-shadow--medium">
            <div className="Box-root">
                <div className="bs-ContentSection-content Box-root Box-divider--surface-bottom-1 Flex-flex Flex-alignItems--center Flex-justifyContent--spaceBetween Padding-horizontal--20 Padding-vertical--16">
                    <div className="Box-root">
                        <span className="ContentHeader-title Text-color--inherit Text-fontSize--16 Text-fontWeight--medium Text-typeface--base Text-lineHeight--28">
                            <ShouldRender if={type !== 'api'}>
                                <span>Quick Tips</span>
                            </ShouldRender>

                            <ShouldRender if={type === 'api'}>
                                <span id="boxTitle">API Documentation</span>
                            </ShouldRender>
                        </span>
                        <span className="ContentHeader-description Text-color--inherit Text-display--inline Text-fontSize--14 Text-fontWeight--regular Text-lineHeight--20 Text-typeface--base Text-wrap--wrap"></span>
                    </div>
                    <ShouldRender if={type !== 'api'}>
                        <div className="ContentHeader-end Box-root Flex-flex Flex-alignItems--center Margin-left--16">
                            <div className="Box-root">
                                <span
                                    className="incident-close-button"
                                    id={`close-quick-tip-${type}`}
                                    onClick={() =>
                                        closeTutorial(type, currentProjectId)
                                    }
                                ></span>
                            </div>
                        </div>
                    </ShouldRender>
                </div>
                <div className="db-Trends-content">
                    <div className="ContentHeader-center Box-root Flex-flex Flex-direction--column Flex-justifyContent--center">
                        <ShouldRender if={type !== 'api'}>
                            // @ts-expect-error ts-migrate(2322) FIXME: Type '{ type: any; }' is not assignable to type 'I... Remove this comment to see the full error message
                            <Tutorial type={type} />
                        </ShouldRender>

                        <ShouldRender if={type === 'api'}>
                            <ApiDoc />
                        </ShouldRender>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const mapDispatchToProps = (dispatch: $TSFixMe) => bindActionCreators({ closeTutorial }, dispatch);

Tutorials.displayName = 'TutorialBox';

Tutorials.propTypes = {
    type: PropTypes.string.isRequired,
    closeTutorial: PropTypes.func.isRequired,
    currentProjectId: PropTypes.string.isRequired,
};

export default connect(null, mapDispatchToProps)(Tutorials);