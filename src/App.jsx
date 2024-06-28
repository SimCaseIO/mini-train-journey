import React, { useState, useEffect } from 'react';

export const App = () => {
  const [gameState, setGameState] = useState('intro');
  const [trainType, setTrainType] = useState(null);
  const [currentStop, setCurrentStop] = useState(0);
  const [isStranded, setIsStranded] = useState(false);
  const [finalDestination, setFinalDestination] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const expressStops = ['Trenton', 'Newark', 'Metropark', 'New York City'];
  const localStops = ['Cornwells Heights', 'Trenton', 'Princeton Junction', 'New Brunswick', 'Metropark', 'Newark', 'New York City'];

  const handleStart = () => setGameState('selectTrain');

  const handleTrainSelect = (type) => {
    setTrainType(type);
    setGameState('confirm');
  };

  const handleConfirm = () => setGameState('journey');

  const handleNextStop = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      if (Math.random() < 0.75) {
        setIsStranded(true);
        setGameState('gameOver');
      } else {
        setCurrentStop(currentStop + 1);
        if (currentStop + 1 === (trainType === 'express' ? expressStops.length : localStops.length) - 1) {
          setGameState('arrived');
        }
      }
    }, 3000);
  };

  const handleExit = () => {
    setFinalDestination(trainType === 'express' ? expressStops[currentStop] : localStops[currentStop]);
    setGameState('gameOver');
  };

  const handleReplay = () => {
    setGameState('intro');
    setTrainType(null);
    setCurrentStop(0);
    setIsStranded(false);
    setFinalDestination(null);
  };

  const renderIntro = () => (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Welcome to the Train Journey Game!</h1>
      <p className="mb-6 text-lg">Embark on an exciting train journey from Philadelphia to New York City. Choose your train wisely and navigate through various stops. But beware, your train might break down at any moment!</p>
      <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105" onClick={handleStart}>Start Your Adventure</button>
    </div>
  );

  const renderTrainSelect = () => (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">Select your train:</h2>
      <div className="space-y-4">
        <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full w-64 transition duration-300 ease-in-out transform hover:scale-105" onClick={() => handleTrainSelect('express')}>Express Train</button>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-full w-64 transition duration-300 ease-in-out transform hover:scale-105" onClick={() => handleTrainSelect('local')}>Local Train</button>
      </div>
      {trainType && (
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full mt-6 transition duration-300 ease-in-out transform hover:scale-105" onClick={handleConfirm}>Confirm</button>
      )}
    </div>
  );

  const renderJourney = () => {
    const stops = trainType === 'express' ? expressStops : localStops;
    const currentStopName = stops[currentStop];

    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Journey Progress</h2>
        <p className="mb-2 text-lg"><span className="font-semibold">Departing From:</span> Philadelphia</p>
        <p className="mb-6 text-lg"><span className="font-semibold">Target Destination:</span> New York City</p>
        {isAnimating ? (
          <div className="mb-6 animate-pulse">
            <p className="text-xl font-bold text-green-600">Approaching next station...</p>
            <div className="mt-4 flex justify-center items-center space-x-2">
              <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        ) : (
          <div className="mb-6 animate-fade-in">
            <p className="text-xl font-bold text-green-600">Now Arriving: {currentStopName}</p>
          </div>
        )}
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full mr-4 transition duration-300 ease-in-out transform hover:scale-105" onClick={handleNextStop} disabled={isAnimating}>Continue to NYC</button>
        {trainType === 'local' && (
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105" onClick={handleExit} disabled={isAnimating}>Exit & Enjoy This City</button>
        )}
      </div>
    );
  };

  const renderGameOver = () => (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">Journey Ended</h2>
      {isStranded ? (
        <p className="mb-4 text-lg">Oh no! Your train has broken down at {trainType === 'express' ? expressStops[currentStop] : localStops[currentStop]}. Better luck next time!</p>
      ) : (
        <p className="mb-4 text-lg">You've decided to end your journey at {finalDestination}. We hope you enjoy your stay!</p>
      )}
      <p className="mb-6 text-lg">You traveled {currentStop} stops on the {trainType} train.</p>
      <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105" onClick={handleReplay}>Play Again</button>
    </div>
  );

  const renderArrived = () => (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">Congratulations!</h2>
      <p className="mb-6 text-lg">You've successfully arrived at New York City. Time to enjoy your day in the Big Apple!</p>
      <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105" onClick={handleReplay}>Play Again</button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-gray-100 rounded-lg shadow-lg p-8">
      {gameState === 'intro' && renderIntro()}
      {gameState === 'selectTrain' && renderTrainSelect()}
      {gameState === 'confirm' && renderTrainSelect()}
      {gameState === 'journey' && renderJourney()}
      {gameState === 'gameOver' && renderGameOver()}
      {gameState === 'arrived' && renderArrived()}
    </div>
  );
};