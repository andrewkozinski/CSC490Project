/**
 * Returns a random Tenna image for loading states because tenna smiling
 */
export const randomTennaLoading = () => {
    const tennaImages = [
        "/images/spr_tenna_t_pose_big.gif",
        "/images/spr_tenna_dance_cabbage_big.gif",
        "/images/spr_tenna_dance_cabbage_big_fast.gif",
        //"/images/spr_tenna_dance_cane_big.gif"
        //"/images/tennabow.gif",
    ];
    const randomIndex = Math.floor(Math.random() * tennaImages.length);
    return tennaImages[randomIndex];  
}