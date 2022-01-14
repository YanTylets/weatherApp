import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import Loading from './Loading';
import { View } from 'react-native-web';
import Weather from './Weather';

const API_KEY = 'db31f62cbcccec97aac3bf68068df580';

export default class extends React.Component {

  state = {
    isLoading: true
  }

  getWeather = async (latitude, longitude) => {
    const {data: {main: {temp}, weather}} = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    this.setState({isLoading: false, temp:temp, condition: weather[0].main});
    console.log(temp, weather[0].main)
  }

  getLocation = async () => {
    try {
      await Location.requestForegroundPermissionsAsync();
      const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync();
      this.getWeather(latitude, longitude);
    } catch (error) {
      Alert.alert('Не могу определить местоположение', "Оче нь грустно :(")
    }

  };

  componentDidMount() {
    this.getLocation();
  }
  render () { 
    return (
      this.state.isLoading ?
      <Loading/> : 
      <Weather 
      temp={Math.round(this.state.temp)}
      condition={this.state.condition}

      />
    );
  }
}
