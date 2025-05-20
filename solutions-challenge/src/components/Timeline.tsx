import React from 'react';
import { 
  ComposedChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface TimelineEvent {
  date: string;
  label: string;
  description?: string;
}

interface TimelineProps {
  events: TimelineEvent[];
  title?: string;
}

const Timeline: React.FC<TimelineProps> = ({ events, title }) => {
  // Convert dates to timestamps for the chart
  const data = events.map(event => ({
    ...event,
    timestamp: new Date(event.date).getTime(),
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const event = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-gray-100">{event.label}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{event.date}</p>
          {event.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{event.description}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="content-timeline my-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h4>
        </div>
      )}
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="timestamp"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}
              stroke="#6b7280"
            />
            <YAxis hide={true} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="timestamp"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#059669' }}
            />
            {data.map((event, index) => (
              <ReferenceLine
                key={index}
                x={event.timestamp}
                stroke="#6b7280"
                strokeDasharray="3 3"
                label={{
                  value: event.label,
                  position: 'top',
                  fill: '#6b7280',
                  fontSize: 12,
                }}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Timeline; 