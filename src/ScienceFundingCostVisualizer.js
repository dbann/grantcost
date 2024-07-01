import React, { useState } from 'react';
import { BarChart, Bar, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ScienceFundingCostVisualizer = () => {
  const [wordsNeeded, setWordsNeeded] = useState(1000);
  const [wordsRequested, setWordsRequested] = useState(6000);
  const [fundingRate, setFundingRate] = useState(15);
  const [hourlyRate, setHourlyRate] = useState(50);
  const [totalApplications, setTotalApplications] = useState(3000);
  const [wordsPerHour, setWordsPerHour] = useState(250);

  // ... (keep all the existing functions: calculateWaste, calculateOpportunityCost, formatNumber, etc.)

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Visualising the cost of funding science via grant applications</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2>Input Parameters</h2>
          <div>
            <label>Words needed for review: {wordsNeeded}</label>
            <input
              type="range"
              min="0"
              max="10000"
              value={wordsNeeded}
              onChange={(e) => setWordsNeeded(Number(e.target.value))}
            />
          </div>
          {/* Repeat similar input fields for wordsRequested, fundingRate, hourlyRate, totalApplications */}
          <div>
            <label>Estimated time spent to write words (per hour):</label>
            <div>
              <input
                type="radio"
                id="slow"
                name="wordsPerHour"
                value="150"
                checked={wordsPerHour === 150}
                onChange={() => setWordsPerHour(150)}
              />
              <label htmlFor="slow">150 words</label>
            </div>
            {/* Repeat for 250 and 350 words options */}
          </div>
        </div>

        <div>
          <h2>Cost Visualization</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ left: 20, right: 20 }}>
              <YAxis 
                yAxisId="left" 
                tickFormatter={(value) => `£${formatNumber(value)}`}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                tickFormatter={(value) => `${formatNumber(value)}hrs`}
              />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="value" fill="#8884d8" name="Total cost (unfunded projects)" />
              <Bar yAxisId="right" dataKey="time" fill="#82ca9d" name="Total time spent (unfunded projects)" />
            </BarChart>
          </ResponsiveContainer>
          {/* Include the rest of the JSX for displaying waste and opportunity cost */}
        </div>
      </div>
      <div>
        <p><strong>Note:</strong> Not included are costs relating to: peer reviewer or panel time, university administrative costs in creating funding applications.</p>
      </div>
      <div>
        <p>Prototype version - feedback (<a href="mailto:david.bann@ucl.ac.uk">david.bann@ucl.ac.uk</a>) very welcome. Made with Claude.ai's help.</p>
      </div>
    </div>
  );
};

export default ScienceFundingCostVisualizer;
