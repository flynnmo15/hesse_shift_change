// Imports
import React, { Component } from "react";
import { StyleSheet, css } from 'aphrodite'

// Table that displays shifts
class Points extends Component {

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
    var fetchFrom = '/api/points';

    return fetch(fetchFrom)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          data: responseJson.data
        });
      })
  }

  /* Add point */
  addPoint = (e, id) => {
    fetch('/api/addPoint', {
      method: 'put',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        adding: this.props.googleId,
        addTo: e.target.value
      })
    }).then(res => res.json())
      .then(response => this.submitSuccess())
      .catch(error => alert('ERROR'));
  }

  /* Subtract point */
  subtractPoint = (e) => {
    fetch('/api/subtractPoint', {
      method: 'put',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subtracting: this.props.googleId,
        subtractFrom: e.target.value
      })
    }).then(res => res.json())
      .then(response => this.submitSuccess())
      .catch(error => alert('ERROR'));
  }

  render() {
    return (
      <div className="Listings">
        <h2>Points</h2>
        <div className={`Points ${css(styles.background)}`}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
	        <th>Points</th>
              </tr>
            </thead>
            <tbody>
            {
              this.state.data.map(function(people) {
                return <tr key={people.id}>
		         <td>{people.name}</td>
			 <td>{people.points}</td>
                         <td><button type="button" onClick={this.addPoint} value={people.id}>Add</button></td>
                         <td><button type="button" onClick={this.subtractPoint} value={people.id}>Subtract</button></td>
		       </tr>;
              }, this)
            }
            </tbody>
          </table>
        </div>
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
 
export default Points;
