import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from 'primereact/card';
import { Progress } from "../../src/components/Progress"
import { Avatar } from 'primereact/avatar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';

function ViewPosts() {


    const currentDateTime = new Date();

    let navigate = useNavigate();
    const [progressspinner, setProgressSpinner] = useState(false)
    const [data, setData] = useState([]);
    const { state } = useLocation();
    const [selectedData, setSelectedData] = useState(null);
    const [visibleDialog, setVisibleDialog] = useState(false);
    const [formData, setFormData] = useState({ Title: '', content: '' });
    const [userData, setUserData] = React.useState({ ...state });
    const [userPost, setUserPost] = useState(null);
    const toast = useRef();
    const [userid,setUserId]=useState(0);


    function handleCancelClick(post){
        //console.log("post",post);
       /* const url = `https://637de434cfdbfd9a63a00317.mockapi.io/test/v2/users/${post.userId}/posts/${post.id}`;

    fetch(url, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => console.log(data.Title))
    .catch(error => console.error(error));
    toast.current.show({ severity: 'success', summary: 'Deleted Message', detail: 'Post Deleted successfully!' }); */
    fetch(`https://637de434cfdbfd9a63a00317.mockapi.io/test/v2/users/${post.userId}/posts/${post.id}`, {
            method: 'DELETE',
          })
          .then(response => response.json())
          .then(data => {
            setUserPost(data);
              setProgressSpinner(false);
              window.location.reload();
          }).catch(error => console.log(error));
        
            //console.log("delete");
        //toast.current.show({ severity: 'success', summary: 'Success Message', detail: 'User Deleted successfully!' });
          
    
    }

    
    const onEdit = (rowData) => {
        setSelectedData(rowData);
        setFormData({ ...rowData });
        setVisibleDialog(true);
    };
    const onViewPosts = (state) => {
        navigate("/viewPosts", { state });
        console.log("row data", state);

    }
    const onDelete = (rowData) => {
        setData(data.filter(item => item.id !== rowData.id));
    };



    const actionButtons = (rowData) => {
        return (
            <div>
                <Button icon="pi pi-book" onClick={() => onViewPosts(rowData)} className="p-button-rounded p-button-warning" />
                <Button icon="pi pi-pencil" onClick={() => onEdit(rowData)} className="p-button-rounded p-button-success p-mr-2" />
                <Button icon="pi pi-trash" onClick={() => onDelete(rowData)} className="p-button-rounded p-button-danger" />
            </div>
        );
    };
    function onBack() {
        navigate('/')
        userData(null)

    }
    const onAdd = () => {
        setVisibleDialog(true);
        setFormData({ Title: '', content: '' });
    };

    const renderFooter = () => {
        return (
            <div>
                <Button label="Save" icon="pi pi-check" onClick={onSave} />
                <Button label="Cancel" icon="pi pi-times" onClick={() => setVisibleDialog(false)} className="p-button-secondary" />
            </div>
        );
    };

    const onSave = async (event) => {
       // console.log("hello");
        // if (formData.id === null) {
        //     setData([...data, formData]);
        // } else {
        //     setData(data.map(item => (item.id === formData.id ? formData : item)));
        // }

        event.preventDefault();
        try {
        const response = await fetch(`https://637de434cfdbfd9a63a00317.mockapi.io/test/v2/users/${userData.id}/posts`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        console.log('Response:', data);
        } catch (error) {
        console.error('Error:', error);
        }
        setVisibleDialog(false);
        window.location.reload(true);
        
    };


    const dialog = (
        <Dialog header={'Create a Post'} visible={visibleDialog} style={{ width: '400px' }} footer={renderFooter()} onHide={() => setVisibleDialog(false)}>
            <div className="p-fluid">
                <div className="p-field mb-3">
                    <label htmlFor="title">Title</label>
                    <InputText id="title" value={formData.Title} onChange={(e) => setFormData({ ...formData, Title: e.target.value })} />
                        <label htmlFor="content" > Content</label>
                    <InputText id="content" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} />
                </div>
            </div>
        </Dialog>
    );

    useEffect(() => {
        setProgressSpinner(true)
        let id = userData.id
        fetch('https://637de434cfdbfd9a63a00317.mockapi.io/test/v2/users/' + id)
            .then(response => response.json())
            .then(data => {
                setUserPost(data);
                setProgressSpinner(false);
            }).catch(error => console.log(error));
    }, [userData.name])

    return (
        <div>
            <Toast ref={toast} />
            <Progress value={progressspinner} />
            <div class="block font-bold text-left p-4 border-round mb-3">
                <Button label="Back" icon="pi pi-chevron-left" className="p-mb-3" onClick={onBack} />
            </div>
            <div class="block font-bold text-right p-4 border-round mb-3">
                <Button label="Create Post" icon="pi pi-plus" className="p-mb-3" onClick={onAdd} />
            </div>

            {/* RECENT POSTS:{userData.map((data) => (
                { data.recent_posts }
            ))} */}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1rem' }}>
                {userPost &&
                    <div>
                        <div className="block font-bold text-center p-2 border-round mb-3">
                            <div class="mb-4">
                                <div class="mb-2">
                                    USER ID:  {userPost.id}
                                </div>
                                <br />
                                NAME:{userPost.name}
                                <br />
                            </div>
                            <div className="p-fluid  grid" style={{ justifyContent: userPost?.recent_posts?.length < 4 ? 'center' : 'none' }}>
                                {userPost?.recent_posts?.map((post, index) => (
                                    <div className="field col-12 md:col-3" >

                                        <Card key={index} style={{ maxHeight: '20rem', minHeight: '20rem' }}>
                                            
                                            <h2>TITLE:</h2>{post.Title}
                                            <h2>{post.content}</h2>
                                            <p>CREATED AT:{post.createdAt}</p>
                                            <Button icon="pi pi-times" className="p-button-rounded p-button-danger mt-2" aria-label="Cancel" onClick={()=>handleCancelClick(post)}/>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                }
                {dialog}
            </div>
        </div >
    )
}
export default ViewPosts