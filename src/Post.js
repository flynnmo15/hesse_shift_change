// Imports
import React, { Component } from "react";
import { Redirect } from 'react-router';
import 'react-google-login';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { StyleSheet, css } from 'aphrodite';

// Displays a form for creating a shift user needs covered
class Post extends Component {

  /* All of the form data is stored inside this state */
  constructor(props) {
    super(props);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.state = {
      shiftDate: '',
      shiftTime: '',
      postedBy: this.props.googleId,
      helpSession: 'No',
      majorPreference: 'None',
      yearPreference: 'None',
      comments: '',
      redirect: false
    };
  }

  /* When an input is changed, update the state. */
  onChange = (e) => {
    /* Because we named the inputs to match their
       corresponding values in state, it's
       super easy to update the state */
    this.setState({ [e.target.name]: e.target.value });
  }

  handleDayClick(day, { selected }) {
    this.setState({
      shiftDate: selected ? undefined : day,
    });
  }

  submitSuccess = () => {
    alert('Form submitted!');  
    this.setState({
      redirect: true
    })
  }
  
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to='/' />
    }
  }

  /* Submit the form */
  onSubmit = (e) => {
    e.preventDefault();

    if(!(this.state.shiftDate && this.state.shiftTime)) {
      alert('ERROR: Date and Time Required');
    } else {
      fetch('/api/shift', {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          shiftDate: this.state.shiftDate,
          shiftTime: this.state.shiftTime,
          postedBy: this.state.postedBy,
          helpSession: this.state.helpSession,
          majorPreference: this.state.majorPreference,
          yearPreference: this.state.yearPreference,
          comments: this.state.comments,
        })
      }).then(res => res.json())
        .then(response => this.submitSuccess())
        .catch(error => alert('ERROR: The form was not submitted.'));
    }
  }

  render() {
    return (
      <div className={`Post ${css(styles.container)}`}>
        {this.renderRedirect()}
        <h2>Post a Shift</h2>
	      <form onSubmit={this.onSubmit}>

          {/* Date of Shift */}
          <DayPicker
	          onDayClick={this.handleDayClick}
          />
          <p>
            <label>Date of Shift (required): </label>
            {this.state.shiftDate
	            ? this.state.shiftDate.toLocaleDateString()
	            : 'Please select a day.'}
	        </p>
          <div className={`${css(styles.selects)}`}>
            {/* Time of Shift */}
            <label htmlFor="shiftTime">Time of Shift (required):</label><br />
            <select id="shiftTime" name="shiftTime" onChange={this.onChange} className={`${css(styles.dropDown)}`}>
              <option value="Select time">Select time</option>
              <option value="10:25 - 11:25 AM">10:25 - 11:25 AM</option>
              <option value="11:25 - 12:25 PM">11:25 - 12:25 PM</option>
              <option value="12:25 - 1:25 PM">12:25 - 1:25 PM</option>
              <option value="1:25 - 2:25 PM">1:25 - 2:25 PM</option>
              <option value="2:25 - 3:25 PM">2:25 - 3:25 PM</option>
              <option value="3:25 - 4:25 PM">3:25 - 4:25 PM</option>
              <option value="4:25 - 5:25 PM">4:25 - 5:25 PM</option>
              <option value="5:30 - 7:30 PM">5:30 - 7:30 PM</option>
              <option value="7:00 - 9:00 PM">7:00 - 9:00 PM</option>				
              <option value="7:30 - 9:30 PM">7:30 - 9:30 PM</option>
              <option value="7:00 - 10:00 PM">7:00 - 10:00 PM</option>
            </select>
            <br />

            {/* Help Session? */}
            <label htmlFor="helpSession">Is this a Help Session?:</label><br />
            <select id="helpSession" name="helpSession" onChange={this.onChange} className={`${css(styles.dropDown)}`}>
              <option value="No">No</option>
              <option value="ECE 100">ECE 100</option>				
              <option value="ECE 222">ECE 222</option>
              <option value="ECE 264">ECE 264</option>
              <option value="ECE 252">ECE 252</option>
              <option value="ME 104">ME 104</option>
              <option value="ME 125">ME 125 - MATLAB</option>	
              <option value="Mechanics">Mechanics of Materials</option>
              <option value="GE 109">GE 109</option>					
            </select>
            <br />
    
            {/* Major Preference? */}
            <label htmlFor="majorPreference">Is there a major preference?:</label><br />
            <select id="majorPreference" name="majorPreference" onChange={this.onChange} className={`${css(styles.dropDown)}`}>
              <option value="None">None</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
              <option value="Electrical">Electrical</option>
              <option value="Computer">Computer</option>
            </select>
            <br />
    
            {/* Year Preference? */}
            <label htmlFor="yearPreference">Is there a year preference?:</label> <br />
            <select id="yearPreference" name="yearPreference" onChange={this.onChange} className={`${css(styles.dropDown)}`}>
              <option value="None">None</option>
              <option value="Freshman">Freshman</option>
              <option value="Sophomore">Sophomore</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
            </select>
            <br />  

            {/* Additional comments */}
            <label htmlFor="comments">Comments:</label> <br />
            <input type="text" id="comments" name="comments" onChange={this.onChange} className={`${css(styles.dropDown)}`}/>
          </div>
	        {/* Submit form */}
	        <input type="submit" />
	      </form>
      </div>
    );
  }
}

// CSS Specific to This Component
const styles = StyleSheet.create({
  dropDown: {
    width:'20%',
    display:'block',
    fontSize:'16px',
    backgroundColor:'#f7f7f7',
    padding: '.6em 1.4em .5em .8em',
    border: '1px solid #aaaaaa',
    margin: '.5rem 0rem',
  },
})

export default Post;
