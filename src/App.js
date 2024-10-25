import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ProjectEshowCase from './components/ProjectEshowCase'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import './App.css'

//This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apStatus = {
  initial: 'initial',
  loading: 'loading',
  success: 'success',
  fail: 'fail',
}

class App extends Component {
  state = {data: [], requestStatus: apStatus.initial, selectedCategory: 'ALL'}

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({requestStatus: apStatus.loading})
    const {selectedCategory} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${selectedCategory}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.projects.map(project => ({
        id: project.id,
        name: project.name,
        imageUrl: project.image_url,
      }))
      this.setState({data: updatedData, requestStatus: apStatus.success})
    } else {
      this.setState({requestStatus: apStatus.fail})
    }
  }

  handleCategoryChange = event => {
    this.setState({selectedCategory: event.target.value}, this.getData)
  }

  loadingView = () => (
    <div data-testid="loader" className="load">
      <Loader type="ThreeDots" color="000FFF" height={50} width={50} />
    </div>
  )

  successView = () => {
    const {data} = this.state
    return (
      <div className="main-container">
        <ul className="project-list">
          {data.map(projectItem => (
            <ProjectEshowCase details={projectItem} key={projectItem.id} />
          ))}
        </ul>
      </div>
    )
  }

  failureView = () => (
    <div className="fail-con">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="ima"
      />
      <h1 className="header">Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button className="but" type="button" onClick={this.getData}>
        Retry
      </button>
    </div>
  )

  finalRender = () => {
    const {requestStatus} = this.state
    switch (requestStatus) {
      case apStatus.loading:
        return this.loadingView()
      case apStatus.success:
        return this.successView()
      case apStatus.fail:
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    const {selectedCategory} = this.state
    return (
      <div>
        <nav className="navbar">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            className="web"
            alt="website logo"
          />
        </nav>
        <div className="main-container">
          <ul className="category-select-container">
            <select
              className="category-select"
              value={selectedCategory}
              onChange={this.handleCategoryChange}
            >
              {categoriesList.map(each => (
                <option value={each.id} key={each.id}>
                  {each.displayText}
                </option>
              ))}
            </select>
          </ul>
          {this.finalRender()}
        </div>
      </div>
    )
  }
}
// Replace your code

export default App
