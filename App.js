import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  getUserMedia
} from 'react-native-webrtc';

global = Object.assign(global, {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  getUserMedia
});
import sdk from 'phenix-web-sdk/dist/phenix-web-sdk-react-native';

sdk.RTC.shim();
export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { webrtcSupported: sdk.RTC.webrtcSupported, videoURL: '' };
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
        <Text>{this.state.webrtcSupported ? 'YES' : 'NO'}</Text>
        <RTCView style={styles.video} streamURL={this.state.videoURL} />
      </View>
    );
  }

  componentDidMount() {
    const config = {
      backendUri: 'https://phenixrts.com/demo'
    };
    const adminApiProxyClient = new sdk.net.AdminApiProxyClient();
    adminApiProxyClient.setBackendUri(config.backendUri);
    adminApiProxyClient.setAuthenticationDataLocationInPayload('header');
    defaultAuth = {
      Accept: 'application/vnd.user-backend.v1'
    };
    adminApiProxyClient.setAuthenticationData({
      Authorization: `bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NDIzNTA0NzAsInN1YiI6Mn0.CcD1D7lgC5KILmxH8Qd5i0wBj7hKkVaET3bxgV4Ssw8`,
      ...defaultAuth
    });
    expressOptions = {
      adminApiProxyClient,
      onError: console.error,
    };
    const channelExpress = new sdk.express.ChannelExpress({
      adminApiProxyClient,
      rtmp: {swfSrc: config.rtmpSwfSrc},
    });
    this.setState({ webrtcSupported: sdk.RTC.webrtcSupported });
    channelExpress.joinChannel(
      {
        alias: 'chanel1',
        subscriberOptions: {bandwidthToStartAt: 700000}
      },
      (error, response) => {
        if (response && response.channelService) {
          this.channelService = response.channelService;
        }
      },
      (error, response, aaaa) => {
        if (response && response.mediaStream) {
          console.log('VIDEO URL', response.mediaStream.getStream().toURL());
          this.setState({ videoURL: response.mediaStream.getStream().toURL() });
        }
      }
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  video: {
    height: 360,
    width: '100%'
  }
});
