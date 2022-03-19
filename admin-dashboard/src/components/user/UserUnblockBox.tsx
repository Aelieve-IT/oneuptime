import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormLoader } from '../basic/Loader';
import ShouldRender from '../basic/ShouldRender';
import { unblockUser } from '../../actions/user';
import { openModal, closeModal } from '../../actions/modal';

export class UserUnblockBox extends Component {
    constructor(props: $TSFixMe) {
        super(props);
        // @ts-expect-error ts-migrate(2540) FIXME: Cannot assign to 'props' because it is a read-only... Remove this comment to see the full error message
        this.props = props;
    }

    handleClick = () => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'unblockUser' does not exist on type 'Rea... Remove this comment to see the full error message
        const { unblockUser, userId } = this.props;
        return unblockUser(userId);
    };

    render() {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'isRequesting' does not exist on type 'Re... Remove this comment to see the full error message
        const { isRequesting } = this.props;

        return (
            <div className="Box-root Margin-bottom--12">
                <div className="bs-ContentSection Card-root Card-shadow--medium">
                    <div className="Box-root">
                        <div className="bs-ContentSection-content Box-root Box-divider--surface-bottom-1 Flex-flex Flex-alignItems--center Flex-justifyContent--spaceBetween Padding-horizontal--20 Padding-vertical--16">
                            <div className="Box-root">
                                <span className="Text-color--inherit Text-display--inline Text-fontSize--16 Text-fontWeight--medium Text-lineHeight--24 Text-typeface--base Text-wrap--wrap">
                                    <span>Unblock This User</span>
                                </span>
                                <p>
                                    <span>
                                        Click the button to unblock this user.
                                    </span>
                                </p>
                            </div>
                            <div className="bs-ContentSection-footer bs-ContentSection-content Box-root Box-background--white Flex-flex Flex-alignItems--center Flex-justifyContent--spaceBetween Padding-horizontal--0 Padding-vertical--12">
                                <span className="db-SettingsForm-footerMessage"></span>
                                <div>
                                    <button
                                        id="unblock"
                                        className="bs-Button bs-Button--blue Box-background--blue"
                                        disabled={isRequesting}
                                        onClick={this.handleClick}
                                    >
                                        <ShouldRender if={!isRequesting}>
                                            <span>Unblock</span>
                                        </ShouldRender>
                                        <ShouldRender if={isRequesting}>
                                            <FormLoader />
                                        </ShouldRender>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// @ts-expect-error ts-migrate(2339) FIXME: Property 'displayName' does not exist on type 'typ... Remove this comment to see the full error message
UserUnblockBox.displayName = 'UserUnblockBox';

const mapDispatchToProps = (dispatch: $TSFixMe) => bindActionCreators({ unblockUser, openModal, closeModal }, dispatch);

const mapStateToProps = (state: $TSFixMe) => {
    const user = state.user.user.user || {};
    const userId = user._id;
    return {
        userId,
        user,
        isRequesting:
            state.user &&
            state.user.unblockUser &&
            state.user.unblockUser.requesting,
    };
};

// @ts-expect-error ts-migrate(2339) FIXME: Property 'propTypes' does not exist on type 'typeo... Remove this comment to see the full error message
UserUnblockBox.propTypes = {
    isRequesting: PropTypes.oneOf([null, undefined, true, false]),
    userId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.oneOf([null, undefined]),
    ]),
    unblockUser: PropTypes.func.isRequired,
};

// @ts-expect-error ts-migrate(2551) FIXME: Property 'contextTypes' does not exist on type 'ty... Remove this comment to see the full error message
UserUnblockBox.contextTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(UserUnblockBox);