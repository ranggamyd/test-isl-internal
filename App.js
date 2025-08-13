import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigators from './src/navigations/AppNavigator';

const App = () => {
    return (
        <NavigationContainer>
            <AppNavigators />
        </NavigationContainer>
    );
};

export default App;