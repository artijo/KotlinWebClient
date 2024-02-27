import { useCookies } from "react-cookie"
import Layout from "../Layout"
import { useEffect, useState } from "react"
import axios from "axios";
import config from "../config";
import { useParams, Link } from "react-router-dom";

interface Cartoon {
    id: number,
    name: string,
    description: string,
    releseDate: string,
    thumbnail: string,
}

interface episode {
    id: number,
    name: string,
    releaseDate: string,
    thumbnail: string,
    episodeNumber: number,
}

export default function Cartoon() {
    const { id } = useParams();
    const [cartoon, setCartoon] = useState({} as Cartoon);
    const [episodes, setEpisodes] = useState<episode[]>([]);

    const [cookies] = useCookies(['token']);

    useEffect(() => {
        document.title = "การ์ตูน";
        if (!cookies.token) {
            document.location.href = '/login?redirect=' + document.location.pathname;
        }
        axios.post(`${config.BASE_URL}/authcheckcreator`, {}, {
            headers: {
                'Authorization': 'Bearer ' + cookies.token
            }
        }).then(res => {
            axios.get(`${config.BASE_URL}/Cartoon/${id}`, {}
            ).then(res => {
                // console.log(res.data);
                setCartoon(res.data);
            }).catch(err => {
                console.log(err);
            })
            axios.get(`${config.BASE_URL}/getAllEpCartoon/${id}`, {}
            ).then(res => {
                // console.log(res.data);
                setEpisodes(res.data);
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            console.log(err);
            if (err.response.status === 401) {
                document.location.href = '/error';
            } else document.location.href = '/login?redirect=' + document.location.pathname;
        })
    }, [])
    return (
        <Layout title="การ์ตูน">
            <div className="mt-5">
                <h1 className="text-2xl font-bold text-gray-900 text-center">{cartoon.name}</h1>
                <div className="flex gap-5 items-center mb-5">
                    <img src={`${config.BASE_URL}/${cartoon.thumbnail}`} alt={cartoon.name} className="w-52 h-auto object-cover" />
                    <div>
                        <p>{cartoon.description}</p>
                        <p>{cartoon.releseDate}</p>
                        <Link to={`/edit/cartoon/${id}`} className="bg-red text-white mt-5 p-2 mx-auto rounded-md">แก้ไขการ์ตูน</Link>
                        <button className="bg-red text-white mt-5 ml-5 p-2 mx-auto rounded-md">ลบการ์ตูน</button>
                    </div>
                </div>
                <div className="grid grid-rows-2 gap-4">
                    {episodes.map((episode, index) => {
                        return (
                            <div key={index} className="flex justify-between items-center p-2">
                                <img src={`${config.BASE_URL}/${episode.thumbnail}`} alt={episode.name} className="w-20 h-auto object-cover" />
                                <div className="flex gap-2">
                                    <h2 className="text-lg font-bold">Episode: {episode.episodeNumber}</h2>
                                    <h2 className="text-lg font-bold">ชื่อตอน {episode.name}</h2>
                                </div>
                                <div>
                                    <Link to={`/edit/episode/${episode.id}`} className="bg-red text-white mt-5 p-2 mx-auto rounded-md">แก้ไขตอน</Link>
                                    <button className="bg-red text-white mt-5 ml-5 p-2 mx-auto rounded-md">ลบตอน</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </Layout>
    )
    }