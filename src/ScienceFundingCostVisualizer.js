import React, { useState } from 'react';
import { BarChart, Bar, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const ScienceFundingCostVisualizer = () => {
  const [wordsNeeded, setWordsNeeded] = useState(1000);
  const [wordsRequested, setWordsRequested] = useState(6000);
  const [fundingRate, setFundingRate] = useState(15);
  const [hourlyRate, setHourlyRate] = useState(50);
  const [totalApplications, setTotalApplications] = useState(3000);
  const [wordsPerHour, setWordsPerHour] = useState(250);

  const calculateWaste = () => {
    const wastedWords = Math.max(wordsRequested - wordsNeeded, 0);
    const wastedTimePerApplication = wastedWords / wordsPerHour;
    const totalWastedTime = wastedTimePerApplication * totalApplications * (100 - fundingRate) / 100;
    const totalWastedMoney = totalWastedTime * hourlyRate;

    return {
      wastedTime: totalWastedTime.toFixed(2),
      wastedMoney: totalWastedMoney.toFixed(2),
    };
  };

  const waste = calculateWaste();

  const chartData = [
    { value: parseFloat(waste.wastedMoney), time: parseFloat(waste.wastedTime) },
  ];

  const calculateOpportunityCost = () => {
    const moneyLost = parseFloat(waste.wastedMoney);
    const timeLost = parseFloat(waste.wastedTime);
    
    return {
      phDStudentships: Math.floor(moneyLost / 20000),
      conferenceBursaries: Math.floor(moneyLost / 1000),
      researchPapers: Math.floor(timeLost / 200),
    };
  };

  const opportunityCost = calculateOpportunityCost();

  const CustomizedLegend = (props) => {
    const { payload } = props;
    return (
      <ul className="flex justify-center space-x-4">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="text-sm">
            {entry.value}
          </li>
        ))}
      </ul>
    );
  };

  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Visualising the cost of funding science via grant applications</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Input Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Words needed for review: {wordsNeeded}</label>
              <Slider
                value={[wordsNeeded]}
                onValueChange={(value) => setWordsNeeded(value[0])}
                max={10000}
                step={100}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Words requested by funder: {wordsRequested}</label>
              <Slider
                value={[wordsRequested]}
                onValueChange={(value) => setWordsRequested(value[0])}
                max={10000}
                step={100}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Applications funded (%): {fundingRate}</label>
              <Slider
                value={[fundingRate]}
                onValueChange={(value) => setFundingRate(value[0])}
                max={100}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Hourly Rate (£): {hourlyRate}</label>
              <Input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                min={1}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Total Applications: {totalApplications}</label>
              <Input
                type="number"
                value={totalApplications}
                onChange={(e) => setTotalApplications(parseInt(e.target.value))}
                min={1}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Estimated time spent to write words (per hour):</label>
              <RadioGroup defaultValue="250" onValueChange={(value) => setWordsPerHour(parseInt(value))}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="150" id="slow" />
                  <Label htmlFor="slow">150 words</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="250" id="medium" />
                  <Label htmlFor="medium">250 words</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="350" id="fast" />
                  <Label htmlFor="fast">350 words</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost Visualization</CardTitle>
          </CardHeader>
          <CardContent>
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
                <Legend content={<CustomizedLegend />} />
                <Bar yAxisId="left" dataKey="value" fill="#8884d8" name="Total cost (unfunded projects)" />
                <Bar yAxisId="right" dataKey="time" fill="#82ca9d" name="Total time spent (unfunded projects)" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              <p>Total Time Spent (unfunded projects): {formatNumber(parseFloat(waste.wastedTime))} hours</p>
              <p>Total Cost (unfunded projects): £{formatNumber(parseFloat(waste.wastedMoney))}</p>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Opportunity Cost</h3>
              <p>The resources spent on unfunded projects could have funded:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>{formatNumber(opportunityCost.phDStudentships)} PhD studentships (£20,000/year)</li>
                <li>{formatNumber(opportunityCost.conferenceBursaries)} Conference bursaries (£1,000 each)</li>
                <li>{formatNumber(opportunityCost.researchPapers)} Research papers (200 hours/paper)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6 text-sm text-gray-600">
        <p><strong>Note:</strong> Not included are costs relating to: peer reviewer or panel time, university administrative costs in creating funding applications.</p>
      </div>
      <div className="mt-2 text-sm text-gray-600">
        <p>Prototype version - feedback (<a href="mailto:david.bann@ucl.ac.uk" className="text-blue-500 hover:underline">david.bann@ucl.ac.uk</a>) very welcome. Made with Claude.ai's help.</p>
      </div>
    </div>
  );
};

export default ScienceFundingCostVisualizer;
