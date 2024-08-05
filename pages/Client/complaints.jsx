import LayoutClient from "@components/Client/layout";
import ComplaintPage from "@components/Client/ComplaintsContent/ComplaintsPage";
import { getTranslations } from '@app/utils/getTranslations';



const Complaints = () => {
    return (
        <>
        <LayoutClient>
                <div className="mt-5 bg-w">
                    <ComplaintPage/>
                </div>
        </LayoutClient>
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