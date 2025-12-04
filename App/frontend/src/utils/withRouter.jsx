import { useNavigate, useParams } from 'react-router-dom';

// HOC to provide router props to class components
export function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    const navigate = useNavigate();
    const params = useParams();
    return <Component {...props} navigate={navigate} params={params} />;
  }
  return ComponentWithRouterProp;
}

