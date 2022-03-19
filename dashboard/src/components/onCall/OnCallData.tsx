import React from 'react';
import PropTypes from 'prop-types';

function OnCallTableHeader({
    text
}: $TSFixMe) {
    return (
        <td
            className="Table-cell Table-cell--align--left Table-cell--verticalAlign--top Table-cell--wrap--noWrap db-ListViewItem-cell"
            style={{ width: 'calc(100% / 3)' }}
        >
            <div
                className="db-ListViewItem-cellContent Box-root Padding-all--8"
                style={{
                    // @ts-expect-error ts-migrate(2322) FIXME: Type '"right" | null' is not assignable to type 'F... Remove this comment to see the full error message
                    float: text === 'Actions' ? 'right' : null,
                    // @ts-expect-error ts-migrate(2322) FIXME: Type 'string | null' is not assignable to type 'Ma... Remove this comment to see the full error message
                    marginRight: text === 'Actions' ? '24px' : null,
                }}
            >
                <span className="db-ListViewItem-text Text-color--dark Text-display--inline Text-fontSize--13 Text-fontWeight--medium Text-lineHeight--20 Text-typeface--upper Text-wrap--wrap">
                    <span>{text}</span>
                </span>
            </div>
        </td>
    );
}

OnCallTableHeader.displayName = 'OnCallTableHeader';

OnCallTableHeader.propTypes = {
    text: PropTypes.string.isRequired,
};

function OnCallTableBody({
    text,
    type
}: $TSFixMe) {
    return type !== 'button' ? (
        <td className="Table-cell Table-cell--align--left Table-cell--verticalAlign--top Table-cell--width--minimized Table-cell--wrap--noWrap db-ListViewItem-cell">
            <div className="db-ListViewItem-cellContent Box-root Padding-all--8">
                <span className="db-ListViewItem-text Text-color--inherit Text-display--inline Text-fontSize--14 Text-fontWeight--regular Text-lineHeight--20 Text-typeface--base Text-wrap--wrap">
                    <div className="Box-root">
                        <span>{text}</span>
                    </div>
                </span>
            </div>
        </td>
    ) : (
        <td
            className="Table-cell Table-cell--align--left Table-cell--verticalAlign--top Table-cell--width--minimized Table-cell--wrap--wrap db-ListViewItem-cell db-ListViewItem-cell--breakWord"
            style={{ height: '1px', minWidth: '160px' }}
        >
            <div className="db-ListViewItem-cellContent Box-root Padding-all--8">
                <span className="db-ListViewItem-text Text-display--inline Text-fontSize--14 Text-lineHeight--20 Text-typeface--base Text-wrap--wrap">
                    <div className="Box-root Margin-right--16">
                        <button className="Button" id="viewOnCallSchedule">
                            <span className="bs-Button">{text}</span>
                        </button>
                    </div>
                </span>
            </div>
        </td>
    );
}

OnCallTableBody.displayName = 'OnCallTableBody';

OnCallTableBody.propTypes = {
    text: PropTypes.string.isRequired,
    type: PropTypes.string,
};

export { OnCallTableBody, OnCallTableHeader };