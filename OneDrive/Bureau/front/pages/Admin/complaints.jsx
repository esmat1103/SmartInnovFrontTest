import LayoutH from "@components/Admin/layoutH";
import ComplaintPage from "@components/Admin/ComplaintContent/complaint";
import { getTranslations } from '../../app/utils/getTranslations';


const Complaints = () => {
    return (
        <>
        <LayoutH >
            
            <ComplaintPage />
            
        </LayoutH>    
        </>
    );

}
export const getServerSideProps = async ({ locale }) => {
    const translations = await getTranslations(locale,['HeaderComplaintsTab','ComplaintsFilter','sidebar','logout'])
    return {
        props: {
          ...translations,
        },
      };
    }
export default Complaints;