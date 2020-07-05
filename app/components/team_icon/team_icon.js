// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import PropTypes from 'prop-types';
import {Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {Client4} from '@mm-redux/client';

import {makeStyleSheetFromTheme} from 'app/utils/theme';

export default class TeamIcon extends React.PureComponent {
    static propTypes = {
        displayName: PropTypes.string,
        lastIconUpdate: PropTypes.number,
        teamId: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
        styleContainer: PropTypes.any,
        styleText: PropTypes.any,
        styleImage: PropTypes.any,
        theme: PropTypes.object.isRequired,
    };

    static defaultProps = {
        displayName: '',
    };

    state = {
        imageError: false,
    };

    componentDidMount() {
        this.mounted = true;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.imageError && prevProps.teamId !== this.props.teamId) {
            this.handleImageError(false);
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    handleImageError = (hasError) => {
        if (this.mounted) {
            this.setState({imageError: Boolean(hasError)});
        }
    };

    render() {
        const {
            displayName,
            lastIconUpdate,
            teamId,
            theme,
            styleContainer,
            styleText,
            styleImage,
        } = this.props;

        const styles = getStyleSheet(theme);

        let teamIconContent;
        if (this.state.imageError || !lastIconUpdate) {
            teamIconContent = (
                <Text style={[styles.text, styleText]}>
                    {displayName?.substr(0, 2).toUpperCase()}
                </Text>
            );
        } else {
            teamIconContent = (
                <FastImage
                    style={[styles.image, styleImage]}
                    source={{uri: Client4.getTeamIconUrl(teamId, lastIconUpdate)}}
                    onError={this.handleImageError}
                />
            );
        }

        return (
            <View style={[styles.container, styleContainer]}>
                {teamIconContent}
            </View>
        );
    }
}

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return {
        container: {
            width: 30,
            height: 30,
            borderRadius: 2,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.sidebarText,
        },
        text: {
            color: theme.sidebarBg,
            fontFamily: 'OpenSans',
            fontWeight: '600',
            fontSize: 15,
        },
        image: {
            borderRadius: 2,
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        },
    };
});
