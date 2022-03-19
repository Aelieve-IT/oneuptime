import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'uuid... Remove this comment to see the full error message
import { v4 as uuidv4 } from 'uuid';
import ShouldRender from '../basic/ShouldRender';
import PropTypes from 'prop-types';
import { updateTwoFactorAuthToken, setTwoFactorAuth } from '../../actions/user';
import { openModal } from '../../actions/modal';
import MessageModal from './MessageModal';

export class UserSetting extends Component {
    constructor(props: $TSFixMe) {
        super(props);
        // @ts-expect-error ts-migrate(2540) FIXME: Cannot assign to 'props' because it is a read-only... Remove this comment to see the full error message
        this.props = props;
        this.state = {
            messageModalId: uuidv4(),
        };
    }

    handleChange = () => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'user' does not exist on type 'Readonly<{... Remove this comment to see the full error message
        const { user, updateTwoFactorAuthToken, setTwoFactorAuth } = this.props;
        if (user) {
            return !user.twoFactorAuthEnabled && user.role === 'user'
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'openModal' does not exist on type 'Reado... Remove this comment to see the full error message
                ? this.props.openModal({
                      // @ts-expect-error ts-migrate(2339) FIXME: Property 'messageModalId' does not exist on type '... Remove this comment to see the full error message
                      id: this.state.messageModalId,
                      content: MessageModal,
                  })
                : !user.twoFactorAuthEnabled && user.role !== 'user'
                ? updateTwoFactorAuthToken(user._id, {
                      twoFactorAuthEnabled: true,
                      email: user.email,
                  }).then(() => {
                      setTwoFactorAuth(true);
                  })
                : updateTwoFactorAuthToken(user._id, {
                      twoFactorAuthEnabled: false,
                      email: user.email,
                  }).then(() => {
                      setTwoFactorAuth(false);
                  });
        }
    };

    render() {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'user' does not exist on type 'Readonly<{... Remove this comment to see the full error message
        let { twoFactorAuthEnabled } = this.props.user;
        if (twoFactorAuthEnabled === undefined) {
            twoFactorAuthEnabled = false;
        }

        return (
            <div className="bs-ContentSection Card-root Card-shadow--medium">
                <div className="Box-root">
                    <div className="bs-ContentSection-content Box-root Box-divider--surface-bottom-1 Flex-flex Flex-alignItems--center Flex-justifyContent--spaceBetween Padding-horizontal--20 Padding-vertical--16">
                        <div className="Box-root" style={{ width: '100%' }}>
                            <span className="Text-color--inherit Text-display--inline Text-fontSize--16 Text-fontWeight--medium Text-lineHeight--24 Text-typeface--base Text-wrap--wrap">
                                <div>
                                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'user' does not exist on type 'Readonly<{... Remove this comment to see the full error message
                                    {this.props.user.deleted ? (
                                        <div
                                            className="Badge Badge--color--red Box-root Flex-inlineFlex Flex-alignItems--center Padding-horizontal--8 Padding-vertical--2"
                                            style={{ float: 'right' }}
                                        >
                                            <span className="Badge-text Text-color--red Text-display--inline Text-fontSize--12 Text-fontWeight--bold Text-lineHeight--16 Text-typeface--upper Text-wrap--noWrap">
                                                <span>Deleted</span>
                                            </span>
                                        </div>
                                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'user' does not exist on type 'Readonly<{... Remove this comment to see the full error message
                                    ) : this.props.user.isBlocked ? (
                                        <div
                                            className="Badge Badge--color--yellow Box-root Flex-inlineFlex Flex-alignItems--center Padding-horizontal--8 Padding-vertical--2"
                                            style={{ float: 'right' }}
                                        >
                                            <span className="Badge-text Text-color--yellow Text-display--inline Text-fontSize--12 Text-fontWeight--bold Text-lineHeight--16 Text-typeface--upper Text-wrap--noWrap">
                                                <span>Blocked</span>
                                            </span>
                                        </div>
                                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'user' does not exist on type 'Readonly<{... Remove this comment to see the full error message
                                    ) : this.props.user.isAdminMode ? (
                                        <div
                                            className="Badge Badge--color--red Box-root Flex-inlineFlex Flex-alignItems--center Padding-horizontal--8 Padding-vertical--2"
                                            style={{ float: 'right' }}
                                        >
                                            <span className="Badge-text Text-color--red Text-display--inline Text-fontSize--12 Text-fontWeight--bold Text-lineHeight--16 Text-typeface--upper Text-wrap--noWrap">
                                                <span>AdminMode</span>
                                            </span>
                                        </div>
                                    ) : (
                                        <div
                                            className="Badge Badge--color--green Box-root Flex-inlineFlex Flex-alignItems--center Padding-horizontal--8 Padding-vertical--2"
                                            style={{ float: 'right' }}
                                        >
                                            <span className="Badge-text Text-color--green Text-display--inline Text-fontSize--12 Text-fontWeight--bold Text-lineHeight--16 Text-typeface--upper Text-wrap--noWrap">
                                                <span>Active</span>
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <span>User Details</span>
                            </span>
                            <p>
                                <span>
                                    Update user email, password, profile picture
                                    and more.
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="bs-ContentSection-content Box-root Box-background--offset Box-divider--surface-bottom-1 Padding-horizontal--8 Padding-vertical--2">
                        <div>
                            <div className="bs-Fieldset-wrapper Box-root Margin-bottom--2">
                                <fieldset className="bs-Fieldset">
                                    <div className="bs-Fieldset-rows">
                                        <div
                                            className="bs-Fieldset-row"
                                            style={{
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <label
                                                className="bs-Fieldset-label user-details-fieldset-label"
                                                style={{
                                                    width: '10rem',
                                                    textAlign: 'left',
                                                }}
                                            >
                                                Full Name
                                            </label>
                                            <div
                                                className="bs-Fieldset-fields"
                                                style={{
                                                    alignItems: 'flex-start',
                                                    maxWidth: '280px',
                                                }}
                                            >
                                                <span className="value">
                                                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'user' does not exist on type 'Readonly<{... Remove this comment to see the full error message
                                                    {this.props.user !==
                                                        undefined &&
                                                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'user' does not exist on type 'Readonly<{... Remove this comment to see the full error message
                                                    this.props.user.name
                                                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'user' does not exist on type 'Readonly<{... Remove this comment to see the full error message
                                                        ? this.props.user.name
                                                        : 'LOADING...'}
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            className="bs-Fieldset-row"
                                            style={{
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <label
                                                className="bs-Fieldset-label user-details-fieldset-label"
                                                style={{
                                                    width: '10rem',
                                                    textAlign: 'left',
                                                }}
                                            >
                                                Email
                                            </label>
                                            <div
                                                className="bs-Fieldset-fields"
                                                style={{
                                                    alignItems: 'flex-start',
                                                    maxWidth: '280px',
                                                    flexDirection: 'row',
                                                }}
                                            >
                                                <span className="value">
                                                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'user' does not exist on type 'Readonly<{... Remove this comment to see the full error message
                                                    {this.props.user !== null &&
                                                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'user' does not exist on type 'Readonly<{... Remove this comment to see the full error message
                                                    this.props.user.email
                                                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'user' does not exist on type 'Readonly<{... Remove this comment to see the full error message
                                                        ? this.props.user.email
                                                        : 'LOADING...'}
                                                </span>
                                                // @ts-expect-error ts-migrate(2339) FIXME: Property 'user' does not exist on type 'Readonly<{... Remove this comment to see the full error message
                                                {!this.props.user.isVerified ? (
                                                    <div
                                                        className="Badge Box-root Flex-inlineFlex Flex-alignItems--center Padding-horizontal--8 Padding-vertical--2"
                                                        style={{
                                                            marginLeft: '5px',
                                                        }}
                                                    >
                                                        <span className="Badge-text Text-color--red Text-display--inline Text-fontSize--14 Text-fontWeight--bold Text-lineHeight--16 Text-wrap--noWrap">
                                                            Not verified
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="Badge Box-root Flex-inlineFlex Flex-alignItems--center Padding-horizontal--8 Padding-vertical--2"
                                                        style={{
                                                            marginLeft: '5px',
                                                        }}
                                                    >
                                                        <span className="Badge-text Text-color--green Text-display--inline Text-fontSize--14 Text-fontWeight--bold Text-lineHeight--16 Text-wrap--noWrap">
                                                            Verified
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div
                                            className="bs-Fieldset-row"
                                            style={{
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <label
                                                className="bs-Fieldset-label user-details-fieldset-label"
                                                style={{
                                                    width: '10rem',
                                                    textAlign: 'left',
                                                }}
                                            >
                                                Company
                                            </label>
                                            <div
                                                className="bs-Fieldset-fields"
                                                style={{
                                                    alignItems: 'flex-start',
                                                    maxWidth: '280px',
                                                }}
                                            >
                                                <span className="value">
                                                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'user' does not exist on type 'Readonly<{... Remove this comment to see the full error message
                                                    {this.props.user !== null &&
                                                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'user' does not exist on type 'Readonly<{... Remove this comment to see the full error message
                                                    this.props.user.companyName
                                                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'user' does not exist on type 'Readonly<{... Remove this comment to see the full error message
                                                        ? this.props.user
                                                              .companyName
                                                        : 'LOADING...'}
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            className="bs-Fieldset-row"
                                            style={{
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <label
                                                className="bs-Fieldset-label user-details-fieldset-label"
                                                style={{
                                                    width: '10rem',
                                                    textAlign: 'left',
                                                }}
                                            >
                                                Phone Number
                                            </label>
                                            <div
                                                className="bs-Fieldset-fields"
                                                style={{
                                                    alignItems: 'flex-start',
                                                    maxWidth: '280px',
                                                }}
                                            >
                                                <span className="value">
                                                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'user' does not exist on type 'Readonly<{... Remove this comment to see the full error message
                                                    {this.props.user !== null &&
                                                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'user' does not exist on type 'Readonly<{... Remove this comment to see the full error message
                                                    this.props.user
                                                        .companyPhoneNumber
                                                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'user' does not exist on type 'Readonly<{... Remove this comment to see the full error message
                                                        ? this.props.user
                                                              .companyPhoneNumber
                                                        : 'LOADING...'}
                                                </span>
                                            </div>
                                        </div>
                                        <ShouldRender
                                            // @ts-expect-error ts-migrate(2339) FIXME: Property 'user' does not exist on type 'Readonly<{... Remove this comment to see the full error message
                                            if={this.props.user.role === 'user'}
                                        >
                                            <div
                                                className="bs-Fieldset-row"
                                                style={{
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <label
                                                    className="bs-Fieldset-label user-details-fieldset-label"
                                                    style={{
                                                        width: '12rem',
                                                        textAlign: 'left',
                                                    }}
                                                >
                                                    Two Factor Authentication{' '}
                                                    <br /> by Google
                                                    Authenticator
                                                </label>
                                                <div
                                                    className="bs-Fieldset-fields"
                                                    style={{
                                                        alignItems:
                                                            'flex-start',
                                                        maxWidth: '253px',
                                                    }}
                                                >
                                                    <label
                                                        id="disableUser2fa"
                                                        className="Toggler-wrap"
                                                        style={{
                                                            marginTop: '10px',
                                                        }}
                                                    >
                                                        <input
                                                            className="btn-toggler"
                                                            type="checkbox"
                                                            onChange={
                                                                this
                                                                    .handleChange
                                                            }
                                                            name="twoFactorAuthEnabled"
                                                            id="twoFactorAuthEnabled"
                                                            checked={
                                                                twoFactorAuthEnabled
                                                            }
                                                        />
                                                        <span className="TogglerBtn-slider round"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </ShouldRender>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </div>

                    <div className="bs-ContentSection-footer bs-ContentSection-content Box-root Box-background--white Flex-flex Flex-alignItems--center Flex-justifyContent--spaceBetween Padding-horizontal--20 Padding-vertical--12">
                        <span className="db-SettingsForm-footerMessage"></span>
                        <div className="bs-Tail-copy">
                            <div
                                className="Flex-flex Flex-direction--row"
                                style={{ marginTop: '10px' }}
                            >
                                // @ts-expect-error ts-migrate(2339) FIXME: Property 'user' does not exist on type 'Readonly<{... Remove this comment to see the full error message
                                <ShouldRender if={!this.props.user}>
                                    <div className="Box-root Margin-right--8">
                                        <div className="Icon Icon--info Icon--color--red Icon--size--14 Box-root" />
                                    </div>
                                    <div className="Box-root Flex-flex">
                                        <span style={{ color: 'red' }}>
                                            User details not found
                                        </span>
                                    </div>
                                </ShouldRender>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// @ts-expect-error ts-migrate(2339) FIXME: Property 'displayName' does not exist on type 'typ... Remove this comment to see the full error message
UserSetting.displayName = 'UserSetting';

const mapDispatchToProps = (dispatch: $TSFixMe) => {
    return bindActionCreators(
        { updateTwoFactorAuthToken, openModal, setTwoFactorAuth },
        dispatch
    );
};

function mapStateToProps(state: $TSFixMe) {
    const user = state.user.user.user || {};
    return {
        userSettings: state.user.userSetting,
        user,
    };
}

// @ts-expect-error ts-migrate(2339) FIXME: Property 'propTypes' does not exist on type 'typeo... Remove this comment to see the full error message
UserSetting.propTypes = {
    user: PropTypes.object.isRequired,
    updateTwoFactorAuthToken: PropTypes.func,
    setTwoFactorAuth: PropTypes.func,
    openModal: PropTypes.func,
    isVerified: PropTypes.bool,
};

// @ts-expect-error ts-migrate(2551) FIXME: Property 'contextTypes' does not exist on type 'ty... Remove this comment to see the full error message
UserSetting.contextTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(UserSetting);