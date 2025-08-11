using UnityEngine;

[RequireComponent(typeof(CharacterController))]
public class SimpleFPS : MonoBehaviour
{
    [Header("Hareket Hızı")]
    public float moveSpeed = 5f;
    [Header("Dönme Hızı")]
    public float lookSpeed = 2f;

    CharacterController cc;
    float pitch = 0f;

    void Start()
    {
        cc = GetComponent<CharacterController>();
        // İmleç ekranda kalacak ama görünür:
        Cursor.lockState = CursorLockMode.Confined;
        Cursor.visible = true;

        if (Camera.main == null) {
            Debug.LogWarning("[SimpleFPS] Sahnede MainCamera etiketiyle bir Camera yok!");
        }
    }

    void Update()
    {
        // 1) KLAVYE İLE HAREKET
        float h = Input.GetAxisRaw("Horizontal"); 
        float v = Input.GetAxisRaw("Vertical");   
        Vector3 move = (transform.forward * v + transform.right * h).normalized;
        cc.SimpleMove(move * moveSpeed);

        // 2) SAĞ MOUSE BASILIYKEN BAKIŞ
        if (Input.GetMouseButton(1) && Camera.main != null)
        {
            float mx = Input.GetAxis("Mouse X") * lookSpeed;
            float my = Input.GetAxis("Mouse Y") * lookSpeed;
            // Yaw
            transform.Rotate(0f, mx, 0f);
            // Pitch
            pitch = Mathf.Clamp(pitch - my, -90f, 90f);
            // Kamerayı eğ
            Camera.main.transform.localEulerAngles = new Vector3(pitch, 0f, 0f);
        }
    }
}
