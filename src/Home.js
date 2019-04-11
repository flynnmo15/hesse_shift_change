// Imports
import React, { Component } from "react";
import { StyleSheet, css } from 'aphrodite'
// Imported Components
import ShiftTable from "./ShiftTable";
 
// Homepage for a particular user
// Will Display shifts the user has posted that have not happened yet
// Will display shifts the user has agreed to cover for other users
class Home extends Component {
  render() {
    return (
      <div className={`Home`}>
        <h2>Home</h2>
        <div className={`Shifts ${css(styles.flexContainer)}`}>
	  <div className={`PostedShifts ${css(styles.shiftListContainer)}`}>
	    <h4>My Posted Shifts</h4>
            <ShiftTable type="posted" googleId={this.props.googleId} />
	  </div>
	  <div className={`CoveredShifts ${css(styles.shiftListContainer)}`}>
	    <h4>My Covered Shifts</h4>
            <ShiftTable type="covered" googleId={this.props.googleId} />
	  </div>
        </div>
      </div>
    );
  }
}
 
// CSS Specific to This Component
const styles = StyleSheet.create({
  flexContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  shiftListContainer: {
    margin: "1rem",
    width: '100%',
  },

})

export default Home;
