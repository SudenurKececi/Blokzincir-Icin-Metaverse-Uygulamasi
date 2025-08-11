using UnityEngine;
using UnityEngine.Networking;
using System.Collections;

[System.Serializable]
public class CidList {
    public string[] cids;
}

public class GalleryController : MonoBehaviour
{
    [Header("CID Listesi Endpoint")]
    public string apiUrl = "http://localhost:4000/api/cids";

    [Header("Pedestal Tag")]
    public string pedestalTag = "Pedestal";

    [Header("ModelLoader Prefab")]
    public GameObject modelLoaderPrefab;

    [Header("Pedestal Üstü Yükseklik")]
    public float yOffset = 0.5f;

    void Start()
    {
        StartCoroutine(FetchAndDisplay());
    }

    IEnumerator FetchAndDisplay()
    {
        // 1) Sahnedeki pedestalleri bul
        var pedestals = GameObject.FindGameObjectsWithTag(pedestalTag);
        Debug.Log($"[Gallery] Pedestal sayısı: {pedestals.Length}");

        // 2) API'den JSON çek
        using var www = UnityWebRequest.Get(apiUrl);
        yield return www.SendWebRequest();

        if (www.result != UnityWebRequest.Result.Success)
        {
            Debug.LogError($"[Gallery] API hatası: {www.error}");
            yield break;
        }

        Debug.Log("[Gallery] Raw JSON: " + www.downloadHandler.text);

        // 3) JSON'u parse et
        var wrapper = JsonUtility.FromJson<CidList>(www.downloadHandler.text);
        var cids    = wrapper?.cids;
        int total   = cids != null ? cids.Length : 0;
        Debug.Log($"[Gallery] CID sayısı: {total}");

        // 4) Kaç model yerleştirebiliyoruz?
        int count = Mathf.Min(pedestals.Length, total);
        Debug.Log($"[Gallery] Yerleştirilecek: {count}");

        // 5) Pedestallere ModelLoader instantiate et
        for (int i = 0; i < count; i++)
        {
            string cid = cids[i];
            string url = $"http://localhost:4000/ipfs/{cid}";
            Debug.Log($"[Gallery] ModelLoader için URL: {url}");

              var go = Instantiate(modelLoaderPrefab);
              go.name = $"NFT_{i}";

              var pedestalPos = pedestals[i].transform.position;
              go.transform.position = pedestalPos + Vector3.up * yOffset;
              go.transform.rotation = Quaternion.identity;

            var ml = go.GetComponent<ModelLoader>();
            if (ml == null)
            {
                Debug.LogError("[Gallery] ModelLoader component bulunamadı!");
                continue;
            }
            ml.modelUrl = url;
            ml.yOffset  = yOffset;
        }
    }
}
