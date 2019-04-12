// Imports
import React, { Component } from "react";
import { StyleSheet, css } from 'aphrodite'
import { NavLink } from "react-router-dom"; // Needed for NavLink


// Table that displays shifts
class ShiftTable extends Component {

  // Need to get table data from database using the api
  // Data will be stored in this.state.data
  constructor(props) {
    super(props); 
    this.state = {
      data: [],
     }
  }

  // When the component is loaded, get the data
  componentDidMount() {
    // default, get everything
    var fetchFrom = '/api/shifts';

    // get specific shifts if necessary
    if (this.props.type === "posted") { fetchFrom = '/api/postedShifts/' + this.props.googleId; }
    else if (this.props.type === "covered") { fetchFrom = 'api/coveredShifts/' + this.props.googleId; }

    return fetch(fetchFrom)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          data: responseJson.data
      });
    })
  }

  render() {
    return (
      <div className={`ShiftTable ${css(styles.background)}`}>
        <table>
          <thead>
            <tr>
              <th>Shift Date</th>
	      <th>Time</th>
	      <th>Posted By</th>
              <th>Covered By</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.data.map(function(shift) {
                return <tr key={shift.id}>
		         <td>{shift.shiftDate}</td>
			 <td>{shift.shiftTime}</td>
			 <td>{shift.postedBy}</td>
			 <td>{shift.coveredBy}</td>
			 <td><NavLink to={`/shift/${shift.id}`} className={`ShiftTable ${css(styles.button)}`}>View</NavLink></td>
		       </tr>;
              })
            }
          </tbody>
        </table>
      </div>
    );
  }

}

// CSS Specific to This Component
const styles = StyleSheet.create({
  background: {
    marginTop: '1rem',
    padding: '1rem 1rem',
    position: 'relative',
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: '10px',
  },
  flexContainer: {
    display: 'flex',
  },
  button: {
    color: 'black',
    border: '2px solid black',
    borderRadius: '5px',
    padding: '10px',
    textAlign: 'center',
    textDecoration: 'none',
  }

})
 
export default ShiftTable;
