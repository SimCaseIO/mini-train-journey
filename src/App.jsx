import React, { useState, useCallback } from 'react';
import { Train, MapPin, AlertTriangle } from 'lucide-react';

const stations = {
  express: ['Philadelphia', 'Trenton', 'Newark', 'New York City'],
  local: [
    'Philadelphia',
    'Cornwells Heights',
    'Trenton',
    'Princeton Junction',
    'New Brunswick',
    'Metropark',
    'Newark',
    'New York City',
  ],
};

const GameContext = React.createContext();

const IntroScreen = () => {
  const { startGame } = React.useContext(GameContext);
  return (
    <div
      className='screen intro-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg shadow-lg'
      role='region'
      aria-label='Game Introduction'>
      <h1 className='text-4xl font-bold mb-6'>
        Welcome to the Train Journey Game!
      </h1>
      <Train className='w-24 h-24 mx-auto mb-6' />
      <p className='text-xl mb-6'>
        Embark on an exciting journey from Philadelphia to New York City!
      </p>
      <button
        onClick={startGame}
        className='bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50'>
        Start Your Journey
      </button>
    </div>
  );
};

const SelectionScreen = () => {
  const { selectTrain, confirmSelection, trainType } =
    React.useContext(GameContext);
  return (
    <div
      className='screen selection-screen bg-gray-100 p-8 rounded-lg shadow-lg'
      role='region'
      aria-label='Train Selection'>
      <h2 className='text-3xl font-bold mb-6 text-gray-800'>
        Select your train type:
      </h2>
      <div
        role='group'
        aria-label='Train type options'
        className='flex justify-center space-x-4 mb-6'>
        <button
          onClick={() => selectTrain('express')}
          className={`train-button ${
            trainType === 'express'
              ? 'bg-green-500 text-white'
              : 'bg-white text-gray-800'
          } border-2 border-green-500 py-3 px-6 rounded-lg transition duration-300 ease-in-out hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50`}
          aria-pressed={trainType === 'express'}>
          Express
        </button>
        <button
          onClick={() => selectTrain('local')}
          className={`train-button ${
            trainType === 'local'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-800'
          } border-2 border-blue-500 py-3 px-6 rounded-lg transition duration-300 ease-in-out hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50`}
          aria-pressed={trainType === 'local'}>
          Local
        </button>
      </div>
      {trainType && (
        <div className='flex justify-center space-x-4 mb-6'>
          <button
            onClick={confirmSelection}
            aria-label='Confirm Selection'
            className='bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50'>
            Confirm Selection
          </button>
        </div>
      )}
    </div>
  );
};

const JourneyScreen = () => {
  const { trainType, currentStation, moveToNextStation, exitTrain } =
    React.useContext(GameContext);
  const [showExitMessage, setShowExitMessage] = useState(false);

  if (!trainType)
    return (
      <div aria-live='polite' className='text-center py-4'>
        Loading...
      </div>
    );

  const currentStationName = stations[trainType][currentStation];
  const nextStationName = stations[trainType][currentStation + 1];
  const isLastStation = currentStation === stations[trainType].length - 1;
  const progress = ((currentStation + 1) / stations[trainType].length) * 100;
  const canExit = trainType === 'local' || isLastStation;

  const handleExitClick = () => {
    if (canExit) {
      exitTrain();
    } else {
      setShowExitMessage(true);
    }
  };

  return (
    <div
      className='screen journey-screen bg-gray-100 p-8 rounded-lg shadow-lg'
      role='region'
      aria-label='Journey Progress'>
      <h2 className='text-3xl font-bold mb-6 text-gray-800'>Your Journey</h2>
      <p className='text-xl mb-4'>
        From <strong className='text-blue-600'>Philadelphia</strong> to{' '}
        <strong className='text-green-600'>New York City</strong>
      </p>
      <div className='journey-info bg-white p-6 rounded-lg shadow mb-6'>
        <p className='text-xl mb-2'>
          Current Station:{' '}
          <strong className='text-blue-600'>{currentStationName}</strong>
        </p>
        <p className='text-xl'>
          Next Station:{' '}
          <strong className='text-green-600'>
            {nextStationName || 'Final Destination'}
          </strong>
        </p>
      </div>
      <div
        className='progress-bar bg-gray-300 rounded-full h-6 overflow-hidden mb-6'
        role='progressbar'
        aria-valuenow={progress}
        aria-valuemin='0'
        aria-valuemax='100'
        aria-label={`Journey progress: ${Math.round(progress)}%`}>
        <div
          className='progress bg-blue-500 h-full transition-all duration-500 ease-out'
          style={{ width: `${progress}%` }}></div>
      </div>
      <div className='journey-buttons flex justify-center space-x-4'>
        {!isLastStation && (
          <button
            onClick={moveToNextStation}
            className='bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50'>
            Next Station
          </button>
        )}
        <button
          onClick={handleExitClick}
          className={`${
            canExit
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
          } font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50`}
          aria-disabled={!canExit}>
          Exit Train
        </button>
      </div>
      {showExitMessage && !canExit && (
        <p className='text-red-600 mt-4' aria-live='polite'>
          You cannot exit the express train until the final station.
        </p>
      )}
    </div>
  );
};

const EndScreen = () => {
  const { outOfService, visitedStations, restartGame, trainType } =
    React.useContext(GameContext);

  if (!visitedStations.length || !trainType)
    return (
      <div aria-live='polite' className='text-center py-4'>
        Loading...
      </div>
    );

  const reachedNYC =
    visitedStations[visitedStations.length - 1] === 'New York City';

  return (
    <div
      className='screen end-screen bg-gray-100 p-8 rounded-lg shadow-lg'
      role='region'
      aria-label='Game End'>
      <h2 className='text-3xl font-bold mb-6 text-gray-800'>
        {outOfService
          ? 'Train Out of Service'
          : reachedNYC
          ? 'Journey Complete'
          : 'Journey Ended'}
      </h2>
      {outOfService ? (
        <AlertTriangle className='w-24 h-24 mx-auto mb-6 text-yellow-500' />
      ) : (
        <MapPin className='w-24 h-24 mx-auto mb-6 text-green-500' />
      )}
      <p className='text-xl mb-6'>
        {outOfService
          ? "Unfortunately, your journey was cut short. You'll need to find alternative transportation."
          : reachedNYC
          ? "Congratulations! You've successfully completed your journey to New York City."
          : "You've decided to end your journey early."}
      </p>
      <div className='stations-visited bg-white p-6 rounded-lg shadow mb-6'>
        <h3 className='text-2xl font-bold mb-4'>Stations visited:</h3>
        <ul className='list-disc list-inside'>
          {visitedStations.map((station, index) => (
            <li key={index} className='text-lg mb-2'>
              {station}
            </li>
          ))}
        </ul>
      </div>
      <p className='text-xl mb-6'>
        You traveled on the {trainType === 'express' ? 'Express' : 'Local'}{' '}
        train.
      </p>
      <button
        onClick={restartGame}
        className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50'>
        Play Again
      </button>
    </div>
  );
};

export const App = () => {
  const [gameState, setGameState] = useState('intro');
  const [trainType, setTrainType] = useState(null);
  const [currentStation, setCurrentStation] = useState(0);
  const [outOfService, setOutOfService] = useState(false);
  const [visitedStations, setVisitedStations] = useState([]);

  const startGame = useCallback(() => setGameState('selection'), []);
  const selectTrain = useCallback((type) => setTrainType(type), []);
  const confirmSelection = useCallback(() => {
    if (trainType) {
      setGameState('journey');
      setVisitedStations([stations[trainType][0]]);
    }
  }, [trainType]);

  const moveToNextStation = useCallback(() => {
    if (!trainType) return;

    const newStation = currentStation + 1;
    setCurrentStation(newStation);
    setVisitedStations((prev) => [...prev, stations[trainType][newStation]]);

    // Decreased probability for both trains going out of service
    const outOfServiceChance =
      trainType === 'express'
        ? 0.15 + newStation * 0.05 // Lower base chance and gentler increase for express
        : 0.1 + newStation * 0.03; // Lower base chance and gentler increase for local

    if (Math.random() < outOfServiceChance) {
      setOutOfService(true);
      setGameState('end');
    } else if (newStation === stations[trainType].length - 1) {
      setGameState('end');
    }
  }, [currentStation, trainType]);

  const exitTrain = useCallback(() => setGameState('end'), []);

  const restartGame = useCallback(() => {
    setGameState('intro');
    setTrainType(null);
    setCurrentStation(0);
    setOutOfService(false);
    setVisitedStations([]);
  }, []);

  const contextValue = {
    gameState,
    trainType,
    currentStation,
    outOfService,
    visitedStations,
    startGame,
    selectTrain,
    confirmSelection,
    moveToNextStation,
    exitTrain,
    restartGame,
  };

  return (
    <GameContext.Provider value={contextValue}>
      <div className='game-container max-w-2xl mx-auto p-8 bg-gray-200 min-h-screen flex items-center justify-center'>
        <div className='w-full'>
          <h1 className='sr-only'>Train Journey Game</h1>
          {gameState === 'intro' && <IntroScreen />}
          {gameState === 'selection' && <SelectionScreen />}
          {gameState === 'journey' && <JourneyScreen />}
          {gameState === 'end' && <EndScreen />}
        </div>
      </div>
    </GameContext.Provider>
  );
};
