import React, { Component } from "react";

//components
import Todo from "./todo";

//images
import Img from '../../images/person.jpg'

class Table extends Component {
  render() {
    return (
      <div>
        <table className="w-full">
          <thead>
            <tr>
              <th width="35%" className="text-purple-600 text-xl text-left">
                This Week's Status
              </th>
              <th>People</th>
              <th width="20%">Status</th>
              <th width="25%">Timeline</th>
              <th>Time Tracking</th>
            </tr>
          </thead>
            <tbody>
            <Todo
            title="Testing 1"
            commentsLength = {2}
            personImg = {Img}
            tracking='1 hour'
            index={0}
            />
            </tbody>
        </table>
      </div>
    );
  }
}

export default Table;
