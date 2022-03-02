import json
import numpy as np
import plotly.graph_objects as go
import plotly

jf = open('data.json', 'r')
json = json.load(jf)

#print(json)
trace1 = {}
trace2 = {}
plot_trace1={}
plot_trace2={}


def to_gpa(kbar):
	"""
	convert pressure from kbar to Gpa.
	"""
	press=kbar.split('d')

	if float(press[0]) == 0.0:
		return float("0.0")

	value = float(press[0])
	power = int(press[1])-1

	return float('{}e{}'.format(value, power))
	

for press in json:
	H2 = json[press]["H2"]
	KH = json[press]["KH"]
	LiH = json[press]["RbH"]
	KLiH3 = json[press]["RbKH3"]

	Phase_spd = float(KH)+float(LiH)+0.5*float(H2)
	
	trace1[to_gpa(press)] = KLiH3
	trace2[to_gpa(press)] = Phase_spd


plot_trace1['x'] = np.array(sorted(trace1.items()))[:, 0]
plot_trace1['y'] = np.array(sorted(trace1.items()))[:, 1]
plot_trace1['name'] = "KLiH3"
plot_trace2['x'] = np.array(sorted(trace2.items()))[:, 0]
plot_trace2['y'] = np.array(sorted(trace2.items()))[:, 1]
plot_trace2['name'] = "KH+LiH+1/2H2"

fig = go.Figure(data=[
	plot_trace1,
	plot_trace2,
]).update_xaxes(
	title="pressure(Gpa)",
	rangeslider={"visible":True},
).update_yaxes(
	title="enthalpy(Ry)"
).update_layout(
	title="Enthalpy plot RbKH3 vs RbH+KH+1/2H2",
)

fig.write_html('plt.html')
	



