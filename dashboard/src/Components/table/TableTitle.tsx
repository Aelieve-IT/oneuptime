import React, { Component } from 'react';
import PropTypes from 'prop-types';

export interface ComponentProps {
    title: string;
}

export default class TableTitle extends Component<TableTitleProps>{
    public static displayName = '';
    public static propTypes = {};
    constructor(props: $TSFixMe) {
        super(props);
    }

    override render() {

        const { title } = this.props;

        return (
            <span className="ContentHeader-title Text-color--inherit Text-display--inline Text-fontSize--16 Text-fontWeight--medium Text-lineHeight--28 Text-typeface--base Text-wrap--wrap">
                <span>{title}</span>
            </span>
        );
    }
}


TableTitle.propTypes = {
    title: PropTypes.string.isRequired,
};