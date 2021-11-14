1. Verify how each of the 3 ways to get data from a multistate are supported
i.e. what is in the data message, and the new config message
NewCONFIG

OnDataUpdate
| Configuration \ Data Shape        | Value         										| Timeseries                          |
| --------------------------------- | ------------- | ------------------------------------|
| Limit attributes                  | Has an limit key with the current value for each of the defined limits              |  Has an attribute called limit      |
| Enumeration set                   | centered      |                                     |
| Bounds                            |  are neat     |                                     |

OnConfigUpdate
| Configuration \ Data Shape        | Value         | Timeseries                          |
| --------------------------------- | ------------- | ------------------------------------|
| Limit attributes                  | IsDynamic=True, Multistates[*].StateValues in same order as newData         |  Has an attribute called limit      |
| Enumeration set                   | centered      |                                     |
| Bounds                            |  are neat     |                                     |

NewData
			Trend | Timeseries
Limit             |           | 
Digital Set       |           |
bounds in display |           |

1. Build a symbol to show labels, as much as possible, it should become a library
It should match the style of config panel in terms of:
[Color]   Name, limit, etc
Order in the window