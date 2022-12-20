import { useNavigate } from "react-router-dom";
import { Context } from '../App';
import { useContext, useEffect } from "react"
import config from '../config';
const ApiUrl = config[process.env.REACT_APP_NODE_ENV || 'development'].apiUrl;

const Redirect = () => {
    const navigate = useNavigate();
    const { setUser } = useContext(Context);

    useEffect(() => {
        const getUser = async () => {
          const res = await fetch(ApiUrl + '/refresh', {
            credentials: "include"
          });
          const session = await res.json();
    
          if (session.user) {
            setUser(session.user);
          } 
          else if (window.location.pathname !== '/') {
            navigate('/')
          }
        }
        getUser();
      }, [navigate, setUser])

}
export default Redirect;