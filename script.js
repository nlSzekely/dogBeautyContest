
const firebaseConfig = {
    apiKey: "AIzaSyCcumXsEvqLT3Bj2ySii73SwrRVdsuuGak",
    databaseURL: "https://test-2fdb2.firebaseio.com",
};


firebase.initializeApp(firebaseConfig);





class App extends React.Component{
    constructor(){
        super()
        this.state = {
            database : [],
            dogs:[],
            firstDog: null,
            secondDog: null,
        }
    }
    componentDidMount=()=>{
        const database = firebase.database().ref('/dogs');
        this.setState({
            database:database
        },()=>{
            this.getDogs();
        })

    }
    // making dogs array from firebase database obj
    getDogs = ()=>{
        const database = this.state.database;
      
        database.on('value',(item)=>{
            const dogs = [];
            const dogsObj = item.val();
            Object.keys(dogsObj).forEach((key)=>{
                dogs.push(dogsObj[key]);
            })
            dogs.sort((a,b)=>{
                if(a.likes < b.likes){
                    return 1;
                }else{
                    return -1;
                }
            })
            this.setState({
                dogs: dogs  
            },()=>{
                setTimeout(()=>{
                    this.setRandomDogs();
                },500) ;
            })
        })  
    }
    // rendering the leaderboard
    renderLeaderBoard = ()=>{
        const top10 = [...this.state.dogs]
        return top10.splice(0,10).map((dog,index)=>{
            return <LeaderBoardCard key={index} dog={dog} place={index+1} />
        })
    }

    getRandomDogs=()=>{
        const randomDog1 = this.state.dogs[Math.floor(this.state.dogs.length * Math.random())];
        const randomDog2 = this.state.dogs[Math.floor(this.state.dogs.length * Math.random())];
        if(randomDog1 === randomDog2){
            return this.getRandomDogs();
        }
        const randomDogs = {
            randomDog1: randomDog1,
            randomDog2: randomDog2,
        }
        return randomDogs;
    }

    setRandomDogs=()=>{
        const randomDogs = this.getRandomDogs();
        this.setState({
            firstDog: randomDogs.randomDog1,
            secondDog: randomDogs.randomDog2,
        })
    
    }

    voteDog=(dog)=>{
        const database = this.state.database;
        database.child(dog.id).update({likes: dog.likes+1 })
    }

    renderPanel = ()=>{
        if(this.state.firstDog && this.state.secondDog){
            return  <VotePanel firstDog={this.state.firstDog} secondDog ={this.state.secondDog} voteDog={this.voteDog} />
        }else{
            return <h1 style={{textAlign:"center"}}>Feeding the dogs please wait...</h1>
        }
    }

 
// RENDER------------------------------------------------------------------------------------------------
    render(){
        return(
            <div className="container">
               <h1 style={{textAlign:"center"}}>Dog Beauty Contest</h1> 
               {this.renderPanel()}
                <div className="leaderBoard">
                    <h1>Leaderboard</h1>  
                    {this.state.dogs.length > 0? this.renderLeaderBoard():"Loading leaderboard..."}
                </div>
                
            </div>
        )
    }
}

const VotePanel = ({firstDog, secondDog,voteDog})=>{
    return(
        <div className="panel">
            <div className="card">
                <img src={firstDog.image} alt={firstDog.name}/>
                <div className="voteBtn">
                    <button onClick={()=>{voteDog(firstDog)}}>Vote</button>
                </div>
            </div>
            <h3>VS</h3>
            <div className="card">
                <img src={secondDog.image} alt={secondDog.name}/>
                <div className="voteBtn">
                    <button onClick={()=>{voteDog(secondDog)}}>Vote</button>
                </div>
            </div>         
        </div>
    )
}

const LeaderBoardCard = ({dog,place})=>{
    return(
        <div className="leaderCard">
            <div>{place}</div>
            <img src={dog.image} alt={dog.name} />
            <h3>{dog.likes}</h3>
        </div>
    )
}


ReactDOM.render(<App/>,document.getElementById("root"));
