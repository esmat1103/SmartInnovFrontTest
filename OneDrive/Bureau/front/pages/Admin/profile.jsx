import LayoutHome from "@components/Admin/layoutHome";
import Profile from "@components/Admin/profile";


const profilePage = () => {
    return (
        <>
        <LayoutHome />  
        <div className="mt-5 bg-w"> 
        <Profile /> </div>    
        </>
    );

}

export default profilePage;