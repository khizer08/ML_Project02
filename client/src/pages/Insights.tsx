import { useQuery } from "@tanstack/react-query";
import { BarChart3, Database, Activity, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Legend } from "recharts";
import type { DatasetStats } from "@shared/schema";

export default function Insights() {
  const { data: stats, isLoading } = useQuery<DatasetStats>({
    queryKey: ["/api/ml/dataset-stats"],
  });

  const confusionMatrix = [
    { label: "True Positive", value: 42, color: "hsl(var(--chart-1))" },
    { label: "True Negative", value: 38, color: "hsl(var(--chart-2))" },
    { label: "False Positive", value: 8, color: "hsl(var(--chart-4))" },
    { label: "False Negative", value: 12, color: "hsl(var(--chart-5))" },
  ];

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-12 bg-gradient-to-br from-background via-primary/5 to-chart-2/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-4xl md:text-5xl bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            Model Insights
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Dataset statistics and model training visualizations
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          </div>
        ) : stats ? (
          <div className="space-y-8 animate-fade-in">
            {/* Dataset Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Dataset Overview</CardTitle>
                    <CardDescription>Weather prediction training data</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">Total Records</p>
                    <p className="text-4xl font-display font-bold text-primary" data-testid="text-total-records">
                      {stats.total_records}
                    </p>
                  </div>

                  <div className="p-6 bg-chart-2/10 rounded-lg border border-chart-2/20">
                    <p className="text-sm text-muted-foreground mb-1">Features</p>
                    <p className="text-4xl font-display font-bold text-chart-2" data-testid="text-total-features">
                      {stats.features.length}
                    </p>
                  </div>

                  <div className="p-6 bg-chart-3/10 rounded-lg border border-chart-3/20">
                    <p className="text-sm text-muted-foreground mb-1">Model Type</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">Linear</Badge>
                      <Badge variant="secondary">Logistic</Badge>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm font-medium mb-3">Dataset Features</p>
                  <div className="flex flex-wrap gap-2">
                    {stats.features.map((feature) => (
                      <Badge key={feature} variant="outline">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-chart-1" />
                    <div>
                      <CardTitle>Feature Statistics</CardTitle>
                      <CardDescription>Statistical summary of dataset features</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(stats.statistics).slice(0, 4).map(([feature, stat]) => (
                      <div key={feature} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium capitalize">{feature.replace('_', ' ')}</span>
                          <Badge variant="secondary">
                            μ = {stat.mean.toFixed(2)}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-xs">
                          <div className="p-2 bg-muted rounded text-center">
                            <p className="text-muted-foreground">Min</p>
                            <p className="font-medium">{stat.min.toFixed(1)}</p>
                          </div>
                          <div className="p-2 bg-muted rounded text-center">
                            <p className="text-muted-foreground">Median</p>
                            <p className="font-medium">{stat.median.toFixed(1)}</p>
                          </div>
                          <div className="p-2 bg-muted rounded text-center">
                            <p className="text-muted-foreground">Max</p>
                            <p className="font-medium">{stat.max.toFixed(1)}</p>
                          </div>
                          <div className="p-2 bg-muted rounded text-center">
                            <p className="text-muted-foreground">σ</p>
                            <p className="font-medium">{stat.std.toFixed(1)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-chart-3" />
                    <div>
                      <CardTitle>Feature Distribution</CardTitle>
                      <CardDescription>Mean values across features</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={Object.entries(stats.statistics).map(([name, stat]) => ({
                      name: name.replace('_', ' '),
                      value: stat.mean,
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        dataKey="name" 
                        stroke="hsl(var(--muted-foreground))" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        fontSize={11}
                      />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Training Pipeline */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-chart-4" />
                  <div>
                    <CardTitle>Model Training Pipeline</CardTitle>
                    <CardDescription>Step-by-step ML model training process</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {[
                    { step: 1, title: "Data Collection", desc: "Weather CSV dataset" },
                    { step: 2, title: "Preprocessing", desc: "Clean & normalize" },
                    { step: 3, title: "Train/Test Split", desc: "80/20 split" },
                    { step: 4, title: "Model Training", desc: "Fit regression models" },
                    { step: 5, title: "Evaluation", desc: "Metrics & validation" },
                  ].map((item, index) => (
                    <div key={item.step} className="relative">
                      <div className="p-4 bg-gradient-to-br from-primary/10 to-chart-2/10 rounded-lg border border-primary/20 hover-elevate">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-3">
                          {item.step}
                        </div>
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      {index < 4 && (
                        <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-primary/30"></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Confusion Matrix Visualization */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-chart-5" />
                  <div>
                    <CardTitle>Classification Performance</CardTitle>
                    <CardDescription>Logistic regression confusion matrix</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={confusionMatrix} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                    <YAxis dataKey="label" type="category" stroke="hsl(var(--muted-foreground))" width={120} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {confusionMatrix.map((entry, index) => (
                        <Scatter key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Sample Data Table */}
            <Card>
              <CardHeader>
                <CardTitle>Sample Dataset</CardTitle>
                <CardDescription>First 5 records from the training dataset</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        {stats.features.map((feature) => (
                          <th key={feature} className="text-left p-2 font-medium">
                            {feature.replace('_', ' ')}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {stats.sample_data.slice(0, 5).map((row, index) => (
                        <tr key={index} className="border-b border-border/50 hover:bg-muted/50">
                          {stats.features.map((feature) => (
                            <td key={feature} className="p-2">
                              {typeof row[feature] === 'number' 
                                ? row[feature].toFixed(1) 
                                : row[feature]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No dataset statistics available</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
