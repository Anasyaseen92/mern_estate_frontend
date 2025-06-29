import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  const [landLord, setLandLord] = useState(null);
  const [message, setMessage ]= useState('');
  const onChange = (e)=>{
    setMessage(e.target.value);
  }

  useEffect(() => {
    const fetchLandLord = async () => {
      try {
        const response = await fetch(`https://mern-estate-backend-pied.vercel.app/api/user/${listing.userRef}`);
        const jsonData = await response.json();
        setLandLord(jsonData);
      } catch (e) {
        console.log(e.message);
      }
    };

    fetchLandLord();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <p>
        Contact
        <span className="font-semibold mx-2">
          {landLord && landLord.userName}
        </span>
        for
        <span className="font-semibold mx-2">{listing.name}</span>
      </p>

      <textarea className="bg-white border w-full p-3 rounded-sm"
       name="message" id="message" value={message} rows={3} onChange={onChange}></textarea>

        {landLord &&
       <Link
       className="uppercase p-3 bg-slate-700 text-center text-white rounded-lg"
        to={`mailto:${landLord.email}?Subject=Regarding ${listing.name}
       &body= ${message}`}>send message</Link>
        }
    </div>
  );
};

export default Contact;