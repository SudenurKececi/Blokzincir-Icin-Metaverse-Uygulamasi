using UnityEngine;
using GLTFast;
using System.Threading.Tasks;

public class ModelLoader : MonoBehaviour
{
    [Tooltip("http://localhost:4000/ipfs/<CID> formatında URL")]
    public string modelUrl;

    [Tooltip("Pedestal üstündeki yükseklik")]
    public float yOffset = 0.5f;

    async void Start()
    {
        Debug.Log($"[ModelLoader] Başlatıldı: {modelUrl}");
        var loader = new GltfImport();
        if (!await loader.Load(modelUrl))
        {
            Debug.LogError($"[ModelLoader] Yüklenemedi: {modelUrl}");
            return;
        }

        //asenkrom instantiate frame by frame olacak şekilde, donmayı engelleyecek
        await loader.InstantiateMainSceneAsync(transform);
       
        transform.localPosition += Vector3.up * yOffset;//pedestaller üzerinde durması için
        await loader.InstantiateMainSceneAsync(transform);//colliderleri devre dışı bıraktım.
        Debug.Log($"[ModelLoader] Tamamlandı: {modelUrl}");
    }
     void DisableAllColliders()
    {
        var colliders = GetComponentsInChildren<Collider>();
        foreach (var col in colliders)
            col.enabled = false;
    }
}
